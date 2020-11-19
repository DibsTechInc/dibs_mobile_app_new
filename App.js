import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import store from './app/store';
import Config from './config.json';
import LandingPage from './app/components/LandingPage';
import EnterEmail from './app/components/AuthPage/EnterEmail';

import {
  LANDING_ROUTE,
  VERIFY_ROUTE,
} from './app/constants/RouteConstants';

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
  }
  render() {
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