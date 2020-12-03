import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'sentry-expo';
import { createAction } from 'redux-actions';

import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  PASSWORD_RESET_ROUTE,
} from '../../constants/RouteConstants';
import Config from '../../../config.json';
import {
  requestCreditCardInfo,
  removeCreditCard,
  requestUserEvents,
  setUpcomingEvents,
  clearCart,
  refreshCartEvents,
  enqueueApiError,
  enqueueNotice,
} from '../index';

export const setUser = createAction('SET_USER', payload => payload);
export const setUserResettingPassword =
  createAction('CREATE_USER_RESETTING_PASSWORD', payload => payload);

/**
 * @param {Object} user json to set in state
 * @returns {function} thunk
 */
export function refreshUser(user) {
  return function innerRefreshUser(dispatch) {
    dispatch(setUser(user));
    dispatch(refreshCartEvents());
  };
}

/**
 * @returns {function} redux thunk
 */
export function syncUserPasses() {
  return async function innerSyncUserPasses(dispatch, getState, dibsFetch) {
    try {
      const { source, studioid } = getState().studio.data;
      const res = await dibsFetch(`/api/user/passes/sync/${source}/${studioid}`, {
        method: 'PUT',
        requiresAuth: true,
      });
      if (res.success) {
        dispatch(refreshUser(res.user));
        return;
      }
      if (res.err) Sentry.captureException(new Error(res.err.message), { logger: 'my.module' });
    } catch (err) {
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  };
}

/**
 * @param {function} callback on complete
 * @returns {function} thunk
 */
export function logOutUser() {
  return async function innerLogOutUser(dispatch) {
    try {
      await AsyncStorage.removeItem(Config.USER_TOKEN_KEY);
      dispatch(setUser({}));
      dispatch(removeCreditCard());
      dispatch(setUpcomingEvents([]));
      dispatch(clearCart());
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  };
}


/**
 * @returns {function} thunk
 */
export function recordStudioVisit() {
  return async function innerRecordStudioVisit(dispatch, getState, dibsFetch) {
    const { studio } = getState();
    try {
      await dibsFetch(`/api/user/visit/${studio.data.id}`, {
        method: 'POST',
        requiresAuth: true,
      });
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  };
}

/**
 * @param {boolean} [showAlert=true] if false will not show native alert on fail
 * @returns {function} thunk
 */
export function requestUserData() {
  return async function innerRequestUserData(dispatch, getState, dibsFetch) {
    const { studio } = getState();
    console.log(`studio ---> ${JSON.stringify(studio)}`);
    try {
      const res = await dibsFetch(`/api/user?dibs_studio_id=${studio.data.id}`, {
        method: 'GET',
        requiresAuth: true,
      });
      if (res.success) {
        dispatch(refreshUser(res.user));
        dispatch(recordStudioVisit());
        dispatch(requestCreditCardInfo());
        dispatch(requestUserEvents());
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      await AsyncStorage.removeItem(Config.USER_TOKEN_KEY);
      dispatch(logOutUser());
    }
  };
}

/**
 * @param {string} email validates email
 * @param {function} callback on complete
 * @returns {function} thunk
 */
export function validateEmail(email) {
  console.log('Got to the validateEmail function');
  return async function innerValidateEmail(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user/email/verify', {
        method: 'POST',
        body: {
          email,
          validate: true,
        },
      });

      if (res.hasMobilePhone) {
        dispatch(setUser({ ...getState().user, hasMobilePhone: res.hasMobilePhone }));
      }
      if (res.success) {
        console.log(`\n\nResponse was a success`);
        return LOGIN_ROUTE;
      }
      if (res.message === 'Needs to reset password') {
        return PASSWORD_RESET_ROUTE;
      }
      if (res.message === 'No user with that email') {
        return REGISTER_ROUTE;
      }
      // Sentry.captureException(new Error(res.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: `${res.message}.` }));
      return null;
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong validating your email.' }));
      return null;
    }
  };
}

/**
 * @param {object} payload user registration data
 * @param {function} callback on complete
 * @returns {function} thunk
 */
export function signUpUser(payload, callback) {
  return async function innerSignUpUser(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user/register', {
        method: 'POST',
        body: {
          ...payload,
          signupMethod: 'mobile app',
        },
      });
      if (res.success) {
        dispatch(setUser(res.user));
        dispatch(recordStudioVisit());
        dispatch(requestUserEvents());
        return callback();
      }
      if (res.accountDisabled) {
        throw new Error('Account disabled');
      }
      dispatch(enqueueApiError({ title: 'Error!', message: `${res.message}.` }));
      return callback(res);
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      if (err.message !== 'Account disabled') {
        dispatch(enqueueApiError({
          title: 'Error!',
          message: err.message,
        }));
      }
      return callback(err);
    }
  };
}

/**
 * @param {string} email of user
 * @param {string} password user entered
 * @param {function} callback on complete
 * @returns {function} thunk
 */
export function submitLogin(email, password, callback) {
  return async function innerUserLogin(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user/login', {
        method: 'POST',
        body: {
          email,
          password,
          dibs_studio_id: getState().studio.data.id,
        },
      });
      if (res.success) {
        dispatch(setUser(res.user));
        dispatch(recordStudioVisit());
        dispatch(syncUserPasses());
        dispatch(requestCreditCardInfo());
        dispatch(requestUserEvents());
        callback(res);
      } else {
        callback(res);
      }
    } catch (err) {
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong logging you in.' }));
      console.log(err);
    }
  };
}

/**
 * updateUser
 * @param {Object} payload from the request
 * @param {function} callback callback function
 * @returns {function} redux thunk
 */
export function updateUser(payload, callback) {
  return async function innerUpdateUser(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user', {
        method: 'PUT',
        body: payload,
        requiresAuth: true,
      });

      if (res.success) {
        dispatch(refreshUser(res.user));
      }
      callback(res);
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      callback({ message: 'Something went wrong updating your account.' });
    }
  };
}

/**
 * @param {Object} payload from the request
 * @param {function} callback callback function
 * @returns {function} redux thunk
 */
export function updateUserPassword(payload) {
  return async function innerUpdateUserPassword(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user/update-password', {
        method: 'PUT',
        body: payload,
        requiresAuth: true,
      });

      if (res.success) {
        dispatch(refreshUser(res.user));
      }

      return res;
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      return {};
    }
  };
}

/**
 * @param {string} list add or remove
 * @param {string} email email of user
 * @param {function} callback callback
 * @returns {function} redux thunk
 */
export function updateUserEmailPreferences(list) {
  return async function innerUpdateUserEmailPreferences(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch(`/api/user/email/suppression-list/${list}`, {
        method: 'PUT',
        requiresAuth: true,
      });

      if (res.success) {
        dispatch(refreshUser(res.user));
      }
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  };
}
/**
 * @param {String} email of user
 * @param {function} callback on complete
 * @returns {function} thunk
 */
export function createPasswordReset(email) {
  return async function innerCreatePasswordReset(dispatch, getState, dibsFetch) {
    const { studio } = getState();
    try {
      const {
        success,
        message,
        userHasMobilephone,
      } = await dibsFetch('/api/user/password/reset', {
        method: 'POST',
        body: {
          email,
          studioId: studio.data.id,
          shortCode: true,
        },
      });
      if (success) return { userHasMobilephone };
      return dispatch(enqueueApiError({ title: 'Error!', message }));
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      return dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong resetting your password.' }));
    }
  };
}

/**
 * @param {string} code to verify on the server
 * @param {string} email the user entered
 * @returns {function} thunk
 */
export function submitPasswordResetCode(code, email) {
  return async function innerSubmitPasswordResetCode(dispatch, getState, dibsFetch) {
    try {
      const { success, uuId, message } = await dibsFetch('/api/user/password/reset', {
        method: 'PUT',
        body: { shortCode: code, email },
      });
      if (success) {
        return uuId;
      }
      dispatch(enqueueApiError({ title: 'Error!', message }));
      return null;
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong verifying your code.' }));
      return null;
    }
  };
}

/**
 * @param {string} uuId of password reset instance
 * @param {string} password new pw set by user
 * @returns {function} thunk
 */
export function submitPasswordReset(uuId, password) {
  return async function innerSubmitPasswordReset(dispatch, getState, dibsFetch) {
    try {
      const { success, token, message, user } = await dibsFetch(`/api/user/password/reset/${uuId}`, {
        method: 'PUT',
        body: { password },
      });
      if (success) {
        await AsyncStorage.setItem(Config.USER_TOKEN_KEY, token);
        dispatch(refreshUser(user));
        dispatch(syncUserPasses());
        dispatch(requestCreditCardInfo());
        dispatch(requestUserEvents());
        dispatch(recordStudioVisit());
        dispatch(enqueueNotice({ title: 'Success!', message: 'Your password has been reset.' }));
        return success;
      }
      if (/expired/.test(message)) {
        dispatch(enqueueApiError({ title: 'Error!', message }));
        return false;
      }
      dispatch(enqueueApiError({ title: 'Error!', message }));
      return false;
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong resetting your password.' }));
      return false;
    }
  };
}

/**
 * @param {object} type,source type is the identifier for the source and source is the data used to retrieve the user
 * @returns {function} redux thunk
 */
export function getUserWaivers({ type, source }) {
  return async function innerGetUserWaivers(dispatch, getState, dibsFetch) {
    try {
      const { studio } = getState();
      const url = `/api/user/waiver/${studio.data.id}/${type}/${source}`;
      const {
        success,
        payload,
        message,
      } = await dibsFetch(url);

      if (success) {
        dispatch(refreshUser(payload.value));
      } else {
        dispatch(enqueueApiError({ title: 'Error!', message }));
      }
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong while getting your waiver status.' }));
    }
  };
}

/**
 * @param {string} waiverChecked whether the user signed the toc
 * @param {string} userid whether the user signed the toc
 * @returns {function} redux thunk
 */
export function updateUserWaiverChecked(waiverChecked, userid) {
  return async function innerUpdateUserWaiverChecked(dispatch, getState, dibsFetch) {
    const { studio } = getState();
    const url = `/api/user/waiver/waiver-checked/${waiverChecked}`;
    try {
      await dibsFetch(url, {
        method: 'PUT',
        body: { userid, dibs_studio_id: studio.data.id },
      });
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'Something went wrong while updating your waiver status.' }));
    }
  };
}

/**
 * @returns {function} redux thunk
 */
export function disableUserAccount() {
  return async function innerDisableUserAccount(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user', {
        requiresAuth: true,
        method: 'DELETE',
      });

      if (res.success) dispatch(logOutUser());
      else dispatch(enqueueApiError({ title: 'Error!', message: `${res.message}.` }));
      return res;
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      dispatch(enqueueApiError({ title: 'Error!', message: 'There was a problem deactivating your account.' }));
      return { success: false };
    }
  };
}

/**
 * @param {string} email user email
 * @param {password} password user's password
 * @param {function} callback callback
 * @returns {function} redux thunk
 */
export function reactivateUserAccount(email, password, callback) {
  return async function innerReactivateUserAccount(dispatch, getState, dibsFetch) {
    try {
      const res = await dibsFetch('/api/user/reactivate', {
        method: 'PUT',
        body: {
          email,
          password,
        },
      });

      callback(res);
    } catch (err) {
      console.log(err);
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      callback(err);
    }
  };
}
