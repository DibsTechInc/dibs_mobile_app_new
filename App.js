import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from './app/store';
import Config from './config.json';
import LandingPage from './app/components/LandingPage';
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

// update packages and start from scratch - only what we need
// set up homepage
// set up authorization -> take the homepage when successful
// determine which screen to show next (login or homepage based on usertoken)
// set the left side menu
// set myAccount
// set up book
// set myCalendar
// make first screen the splash image
// set up loader


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
    }
  }
  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    await this.getAssets();
  }
  /**
   * @returns {undefined}
   */
  async getAssets() {
    try {
      const token = await AsyncStorage.getItem(Config.USER_TOKEN_KEY);
      let studioData = await AsyncStorage.getItem(Config.STUDIO_DATA_KEY);

      console.log(`studioData = ${studioData}`);

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
      console.log(`error --> ${err}`);
      AsyncStorage.clear();
      this.setState({ fetchedAssets: false, errorOccurred: true });

    }
  }
  render() {
    console.log(`\n\n####### TESTING VARIABLES`);
    console.log(`fetchedAssets = ${this.state.fetchedAssets}`);

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={LANDING_ROUTE}
            screenOptions={{
              headerShown: false,
              headerStyle: { backgroundColor: Config.STUDIO_COLOR } 
              }}>
            <Stack.Screen name={LANDING_ROUTE} component={LandingPage}/>
            <Stack.Screen name={VERIFY_ROUTE} component={EnterEmail}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;