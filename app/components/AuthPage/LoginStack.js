import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Config from '../../../config.json';
import LandingPage from '../LandingPage';
import LinearLoader from '../shared/LinearLoader';
import EnterEmail from '../AuthPage/EnterEmail';
import EnterPassword from '../AuthPage/EnterPassword';
import MainPage from '../MainPage';
import TermsAndConditions from '../AuthPage/TermsAndConditions';
import UserSettings from '../ProfilePage/UserSettings';
import EditEmail from '../ProfilePage/EditEmail';
import EditUserName from '../ProfilePage/EditUserName';
import EditCC from '../ProfilePage/EditCC';
import EditPassword from '../ProfilePage/EditPassword';
import FAQ from '../ProfilePage/FAQ';
import ProfilePage from '../ProfilePage/ProfilePage';
import SchedulePage from '../SchedulePage';

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
    SCHEDULE_ROUTE,
  } from '../../constants/RouteConstants';


const Stack = createStackNavigator();



/**
 * @class LoginStack
 * @extends {React.PureComponent}
 */
class LoginStack extends React.PureComponent {
  /**
   * @constructor
   * @constructs LoginStack
   */
  constructor() {
    super();
    
  }
  /**
   * render
   * @returns {JSX.Element} XML
   */
  render() {
    console.log(`\n\n`);
    console.log('inside of LoginStack');
    // console.log(`this.state.userToken = ${this.state.userToken}`);
   
    return (
        <Stack.Navigator 
        initialRouteName={VERIFY_ROUTE}
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: Config.STUDIO_COLOR } 
          }}>
        <Stack.Screen name={VERIFY_ROUTE} component={EnterEmail}/>
        <Stack.Screen name={LOGIN_ROUTE} component={EnterPassword}/>
      </Stack.Navigator>
    );
  }
}

export default LoginStack;
