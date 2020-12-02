import { createActions } from 'redux-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'sentry-expo';
import Config from '../../../config.json';
// import { enqueueApiError } from '../';

export const {
  setStudio,
  setStudioLoadingTrue,
  setStudioLoadingFalse,
} = createActions({
  SET_STUDIO: payload => payload,
  SET_STUDIO_LOADING_TRUE: () => true,
  SET_STUDIO_LOADING_FALSE: () => false,
});

/**
 * @param {boolean} [showAlert=true] if false will not show native alert on fail
 * @param {string|number} locationId the location id for flex specifically
 * @returns {function} thunk
 */
export function requestStudioData(showAlert = true) {
  const id = Config.DIBS_STUDIO_ID;
  console.log(`requestStudioData id -> ${id}`);

  return async function innerRequestStudioData(dispatch, getState, dibsFetch) {
    if (getState().studio.loading) return;
    try {
      const path = `/api/studio?new_id_format=1&studioid=${id}`;
      dispatch(setStudioLoadingTrue());
      const res = await dibsFetch(path, { method: 'GET' });
      if (res.success) {
        dispatch(setStudio(res.studio));
        await AsyncStorage.setItem(String(id), JSON.stringify(res.studio));
        dispatch(setStudioLoadingFalse());
        return;
      }
      if (showAlert) dispatch(enqueueApiError({ text: 'Something went wrong loading your app.', message: `${res.message}.` }));
      else throw new Error(res.message);
      return;
    } catch (err) {
      console.log(err);
      Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      if (showAlert) dispatch(enqueueApiError({ title: 'Something went wrong loading your app.' }));
      else throw err;
    }
  };
}
