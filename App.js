import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { View, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components';
import { Updates } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation'
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';

import store from './app/store';
import Config from './config.json';
import Navigator from './app/router';
import LinearLoader from './app/components/shared/LinearLoader';
import Modal from './app/components/Modal';

import StudioFont from './assets/fonts/Regular.ttf';
import StudioFontHeavy from './assets/fonts/Bold.ttf';
import { 
  removeExpiredEvents,
  requestEventData,
  setStudio,
  requestStudioData,
  requestUserData,
  syncUserEvents,
  syncUserPasses,
 } from './app/actions';

 import { getUserIsResettingPassword } from './app/selectors';

// Image imports for cashing
import MainPage from './assets/img/main-page.png';
import ActivityGrey from './assets/img/activity-grey.png';
import ActivityWhite from './assets/img/activity-white.png';
import CalendarGrey from './assets/img/calendar-grey.png';
import CalendarWhite from './assets/img/calendar-white.png';
import CartGrey from './assets/img/cart-grey.png';
import CartWhite from './assets/img/cart-white.png';
import MainGrey from './assets/img/main-grey.png';
import Amex from './assets/img/stp_card_amex.png';
import Diners from './assets/img/stp_card_diners.png';
import Discover from './assets/img/stp_card_discover.png';
import JCB from './assets/img/stp_card_jcb.png';
import MasterCard from './assets/img/stp_card_mastercard.png';
import Unknown from './assets/img/stp_card_unknown.png';
import Visa from './assets/img/stp_card_visa.png';
import TrashGrey from './assets/img/trash-grey.png';
import UserGrey from './assets/img/user-grey.png';
import UserWhite from './assets/img/user-white.png';
import FilterWhite from './assets/img/filter-white.png';
import CheckWhite from './assets/img/check-white.png';
import AddToCalendar from './assets/img/add-to-calendar.png';
import MyClassesIcon from './assets/img/my-classes.png';
import ColumnSpotBooking from './assets/img/column-spotbooking.png';
import DoorSpotBooking from './assets/img/door-spotbooking.png';

Sentry.init({
  dsn: Config.SENTRY_DSN
});

const StyledLoadingPage = styled.View`
  align-items: center;
  background: ${Config.STUDIO_COLOR};
  justify-content: center;
  flex: 5;
`;

/**
 * @class App
 * @extends Component
 */
class App extends Component {
  /**
   * @constructor
   * @constructs App
   */
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      userToken: null,
      fetchedAssets: false,
      imageLoaded: false,
      errorOccured: false,
      appState: AppState.currentState,
    }
    this.onAppStateChange = this.onAppStateChange.bind(this);
    AppState.addEventListener('change', this.onAppStateChange);
    
  }
  /**
  * @returns {undefined}
  */
 async getFonts() {
  await Font.loadAsync({
    'studio-font': StudioFont,
    'studio-font-heavy': StudioFontHeavy,
  });
  this.setState({ fontLoaded: true });
  }
  /**
   * @returns {undefined}
   */
  async getImages() {
    await Asset.loadAsync([
      MainPage,
      ActivityGrey,
      ActivityWhite,
      CalendarGrey,
      CalendarWhite,
      CartGrey,
      CartWhite,
      MainGrey,
      Amex,
      Diners,
      Discover,
      JCB,
      MasterCard,
      Unknown,
      Visa,
      TrashGrey,
      UserGrey,
      UserWhite,
      FilterWhite,
      CheckWhite,
      AddToCalendar,
      MyClassesIcon,
      ColumnSpotBooking,
      DoorSpotBooking,
    ]);

    this.setState({ imageLoaded: true });
  }
  /**
   * @returns {undefined}
   */
  async getAssets() {
    
    try {
      console.log('inside of getAssets()');
      console.log(`Config USER_TOKEN = ${Config.USER_TOKEN_KEY}`);
      console.log(Config.USER_TOKEN_KEY);
      const token = await AsyncStorage.getItem(Config.USER_TOKEN_KEY);
      console.log(`token = ${token}`);
      let studioData = await AsyncStorage.getItem(Config.STUDIO_DATA_KEY);
      console.log(`studioData => ${studioData}`);

      if (studioData && studioData.length) {
        studioData = JSON.parse(studioData);
        store.dispatch(setStudio(studioData));
      } else await store.dispatch(requestStudioData(false));

      if (token) {
        await store.dispatch(requestUserData());
      }
      this.setState({
        fetchedAssets: true,
        userToken: token,
      })

      if (await AsyncStorage.getItem(Config.STUDIO_DATA_KEY)) await store.dispatch(requestStudioData(false));

      if (token) {
        await store.dispatch(syncUserEvents());
        await store.dispatch(syncUserPasses());
      }
    } catch (err) {
      AsyncStorage.clear();
      store.dispatch(logFatalError(err));
      Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      this.setState({ fetchedAssets: false, errorOccurred: true });
    }
  }
  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    await this.getFonts();
    await this.getAssets();
    await this.getImages();
    
    try {
      // can we get the state of the store
      const state = store.getState();
      console.log(`state => ${JSON.stringify(state)}`);
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      
      if (
        !(await AsyncStorage.getItem(Config.USER_TOKEN_KEY))
        || !state.user.id
        || !state.studio.data
      ) return;
      store.dispatch(removeExpiredEvents());
      store.dispatch(requestEventData({}, false));

    } catch (err) {
      console.error(err);
    }
  }

  componentWillUnmount() {
    clearInterval(this.eventRefreshInterval);
    AppState.removeEventListener('change', this.onAppStateChange);
  }
  /**
   * @param {string} nextAppState after it changes
   * @returns {undefined}
   */
  onAppStateChange(nextAppState) {
    console.log('inside of onAppStateChange');
    if (getUserIsResettingPassword(store.getState())) return;
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getUpdates();
      this.setState({ fetchedAssets: false }, () => this.getAssets());
    }
    this.setState({ appState: nextAppState });
  }
  /**
   * @returns {undefined}
   */
  async getUpdates() {
    if (__DEV__) return;

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Updates.reload();
      }
    } catch (err) {
      console.log(err);
      Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  }
  

  render() {
    console.log('testing here');
    console.log(`fontLoaded => ${this.state.fontLoaded}`);
    console.log(`appState: ${this.state.appState}`);
    console.log(`fetchedAssets: ${this.state.fetchedAssets}`);
    console.log(`imageLoaded: ${this.state.imageLoaded}`);

    return (
      <Provider store={store}>
        <View style={{ flex: 1}}>
          {(this.state.fetchedAssets && this.state.imageLoaded) ? (
            <Navigator userToken={this.state.userToken} />
          ) : (
            <StyledLoadingPage>
              <LinearLoader showQuote={this.state.fontLoaded} />
            </StyledLoadingPage>
          )}  
          <Modal />
        </View>
      </Provider>
    );
  }
}
export default App;