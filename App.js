import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import styled from 'styled-components';
import { Asset } from 'expo-asset';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Updates from 'expo-updates';
import * as Sentry from 'sentry-expo';

import store from './app/store';
import Config from './config.json';
import LandingPage from './app/components/LandingPage';
import LinearLoader from './app/components/shared/LinearLoader';
import EnterEmail from './app/components/AuthPage/EnterEmail';
import EnterPassword from './app/components/AuthPage/EnterPassword';
import MainPage from './app/components/MainPage';
import TermsAndConditions from './app/components/AuthPage/TermsAndConditions';
import UserSettings from './app/components/ProfilePage/UserSettings';
import EditEmail from './app/components/ProfilePage/EditEmail';
import EditUserName from './app/components/ProfilePage/EditUserName';
import EditCC from './app/components/ProfilePage/EditCC';
import EditPassword from './app/components/ProfilePage/EditPassword';
import FAQ from './app/components/ProfilePage/FAQ';
import ProfilePage from './app/components/ProfilePage/ProfilePage';

import {
  LANDING_ROUTE,
  VERIFY_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  SETTINGS_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  EDIT_USERNAME_ROUTE,
  EDIT_EMAIL_ROUTE,
  FAQ_ROUTE,
  EDIT_PASSWORD_ROUTE,
  EDIT_CC_ROUTE,
  PROFILE_ROUTE,
} from './app/constants/RouteConstants';

import {
  requestStudioData,
  requestUserData,
  syncUserEvents,
  syncUserPasses,
  setStudio,
} from './app/actions';


// Image imports for caching
import MainPageImg from './assets/img/main-page.png';
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




const StyledLoadingPage = styled.View`
  align-items: center;
  background: ${Config.STUDIO_COLOR};
  justify-content: center;
  flex: 5;
`;

const Stack = createStackNavigator();


class App extends React.Component {
  /**
   * @constructor
   * @cosntructs App
   */
  constructor() {
    super();
    this.state = {
      fetchedAssets: false,
      errorOccurred: false,
      userToken: null,
      fontLoaded: false,
      imageLoaded: false,
    }
  }
  // async _loadFontsAsync() {
  //   await Font.loadAsync(customFonts);
  //   this.setState({ fontLoaded: true });
  // }
  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    this.getFonts();
    await this.getAssets();
    await this.getImages();
  }
  /**
   * @returns {undefined}
   */
  async getUpdates() {
    if (__DEV__) return;

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Updates.reloadAsync();
      }
    } catch (err) {
      console.log(err);
      Sentry.captureException(new Error(err.message), { logger: 'my.module' });
    }
  }
  /**
   * @returns {undefined}
   */
  async getFonts() {
    try {
      const fonts = {
        'studio-font': require('./assets/fonts/Regular.ttf'),
        'studio-font-heavy': require('./assets/fonts/Bold.ttf'),
      };
      await Font.loadAsync(fonts);
      this.setState({ fontLoaded: true });
    } catch(err) {
      console.log('something happening here');
      console.log(err);
    } 
  }
  /**
   * @returns {undefined}
   */
  async getImages() {
    await Asset.loadAsync([
      MainPageImg,
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
      const token = await AsyncStorage.getItem(Config.USER_TOKEN_KEY);
      let studioData = await AsyncStorage.getItem(Config.STUDIO_DATA_KEY);

      console.log(`studioData = ${studioData}`);
      console.log(`user token key = ${Config.USER_TOKEN_KEY}`);

      // populate studio info
      if (studioData && studioData.length) {
        studioData = JSON.parse(studioData);
        store.dispatch(setStudio(studioData));
      } else await store.dispatch(requestStudioData(false));

      // populate user info
      if (token) {
        await store.dispatch(requestUserData());
      }
      this.setState({ fetchedAssets: true, userToken: token });

      if (await AsyncStorage.getItem(Config.STUDIO_DATA_KEY)) await store.dispatch(requestStudioData(false));
      if (token) {
        await store.dispatch(syncUserEvents());
        await store.dispatch(syncUserPasses());
      }

    } catch(err) {
      console.log(`\n\n\nerror --> ${err}`);
      AsyncStorage.clear();
      this.setState({ fetchedAssets: false, errorOccurred: true });

    }
  }
  render() {
    console.log(`\n\n####### TESTING VARIABLES`);
    console.log(`fetchedAssets = ${this.state.fetchedAssets}`);
    const initialRoute = `${this.state.userToken ? LANDING_ROUTE : VERIFY_ROUTE}`;
    console.log(`initalRoute = ${initialRoute}`);
    console.log(`userToken = ${this.state.userToken}`);
    console.log(`fonts loaded = ${this.state.fontLoaded}`);
    // console.log(`font function: ${Font.isLoaded()}`);

    return (
      <Provider store={store}>
        <NavigationContainer>
          {(this.state.fontLoaded) ? (
            <Stack.Navigator 
              initialRouteName={initialRoute}
              screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: Config.STUDIO_COLOR } 
                }}>
              <Stack.Screen name={LANDING_ROUTE} component={LandingPage}/>
              <Stack.Screen name={VERIFY_ROUTE} component={EnterEmail}/>
              <Stack.Screen name={LOGIN_ROUTE} component={EnterPassword}/>
              <Stack.Screen name={MAIN_ROUTE} component={MainPage}/>
              <Stack.Screen name={SETTINGS_ROUTE} component={UserSettings}/>
              <Stack.Screen name={FAQ_ROUTE} component={FAQ}/>
              <Stack.Screen name={PROFILE_ROUTE} component={ProfilePage}/>
              <Stack.Screen name={TERMS_AND_CONDITIONS_ROUTE} component={TermsAndConditions}/>
              <Stack.Screen name={EDIT_EMAIL_ROUTE} component={EditEmail}/>
              <Stack.Screen name={EDIT_USERNAME_ROUTE} component={EditUserName}/>
              <Stack.Screen name={EDIT_CC_ROUTE} component={EditCC}/>
              <Stack.Screen name={EDIT_PASSWORD_ROUTE} component={EditPassword}/>
            </Stack.Navigator>
          ) : (
            <StyledLoadingPage>
                <LinearLoader showQuote={this.state.fontLoaded} />
              </StyledLoadingPage>
          )}
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;