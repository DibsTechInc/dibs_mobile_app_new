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
 * @class NavigationStack
 * @extends {React.PureComponent}
 */
class NavigationStack extends React.PureComponent {
  /**
   * @constructor
   * @constructs NavigationStack
   */
  constructor() {
    super();
    
  }
  /**
   * render
   * @returns {JSX.Element} XML
   */
  render() {
   
    return (
        <Stack.Navigator 
        initialRouteName={MAIN_ROUTE}
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
        <Stack.Screen name={SCHEDULE_ROUTE} component={SchedulePage}/>
      </Stack.Navigator>
    );
  }
}

export default NavigationStack;
