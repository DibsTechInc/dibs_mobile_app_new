import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import styled from 'styled-components';

import store from './app/store';
import Config from './config.json';
import LandingPage from './app/components/LandingPage';
import LinearLoader from './app/components/shared/LinearLoader';
import EnterEmail from './app/components/AuthPage/EnterEmail';

import {
  LANDING_ROUTE,
  VERIFY_ROUTE,
} from './app/constants/RouteConstants';

import {
  requestStudioData,
  requestUserData,
  syncUserEvents,
  syncUserPasses,
  setStudio,
} from './app/actions';

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
    this.getFonts();
    await this.getAssets();
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