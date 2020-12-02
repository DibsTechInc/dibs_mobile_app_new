import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppContainer } from '@react-navigation/compat';
import { createStackNavigator } from '@react-navigation/stack';
import Config from '../../config.json';

import {
  LANDING_ROUTE,
  VERIFY_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  DRAWER_ROUTE,
  PASSWORD_RESET_ROUTE,
  SETTINGS_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  EDIT_USERNAME_ROUTE,
  EDIT_PASSWORD_ROUTE,
  EDIT_EMAIL_ROUTE,
  EDIT_CC_ROUTE,
  CLASS_INFO_ROUTE,
} from '../constants/RouteConstants';

import {
  EnterPassword,
  EnterEmail,
  Signup,
  PasswordReset,
  TermsAndConditions,
} from '../components/AuthPage';

import LandingPage from '../components/LandingPage';
import Drawer from '../components/Drawer';

import {
  UserSettings,
  EditUserName,
  EditPassword,
  EditEmail,
  EditCC,
} from '../components/ProfilePage';

import ClassDetail from '../components/MyClasses/ClassDetail';

const Stack = createStackNavigator();

function myStack(token) {
  return (
    <Stack.Navigator 
    initialRouteName={token ? DRAWER_ROUTE : LANDING_ROUTE}
    headerMode='none'
    options={{gestureEnabled: true}}
    >
    <Stack.Screen name={LANDING_ROUTE} component={LandingPage} options={{ gestureEnabled: false }}/>
    <Stack.Screen name={VERIFY_ROUTE} component={EnterEmail} />
    <Stack.Screen name={LOGIN_ROUTE} component={EnterPassword} />
    <Stack.Screen name={REGISTER_ROUTE} component={Signup} />
    <Stack.Screen name={TERMS_AND_CONDITIONS_ROUTE} component={TermsAndConditions} />
    <Stack.Screen name={PASSWORD_RESET_ROUTE} component={PasswordReset} />
    <Stack.Screen name={DRAWER_ROUTE} component={Drawer} options={{gestureEnabled: false}} />
    <Stack.Screen name={SETTINGS_ROUTE} component={UserSettings} />
    <Stack.Screen name={EDIT_USERNAME_ROUTE} component={EditUserName} />
    <Stack.Screen name={EDIT_EMAIL_ROUTE} component={EditEmail} />
    <Stack.Screen name={EDIT_CC_ROUTE} component={EditCC} />
    <Stack.Screen name={CLASS_INFO_ROUTE} component={ClassDetail} />
    <Stack.Screen name={EDIT_PASSWORD_ROUTE} component={EditPassword} />
  </Stack.Navigator>

  );
}
// const stackNav = (token) => {(
  
// )};
//   {
//     [LANDING_ROUTE]: {
//       screen: LandingPage,
//       navigationOptions: {
//         gestureEnabled: false,
//       },
//     },
//     [VERIFY_ROUTE]: {
//       screen: EnterEmail,
//     },
//     [LOGIN_ROUTE]: {
//       screen: EnterPassword,
//     },
//     [REGISTER_ROUTE]: {
//       screen: Signup,
//     },
//     [TERMS_AND_CONDITIONS_ROUTE]: {
//       screen: TermsAndConditions,
//     },
//     [PASSWORD_RESET_ROUTE]: {
//       screen: PasswordReset,
//     },
//     [DRAWER_ROUTE]: {
//       screen: Drawer,
//       navigationOptions: {
//         gestureEnabled: false,
//       },
//     },
//     [SETTINGS_ROUTE]: {
//       screen: UserSettings,
//     },
//     [EDIT_USERNAME_ROUTE]: {
//       screen: EditUserName,
//     },
//     [EDIT_EMAIL_ROUTE]: {
//       screen: EditEmail,
//     },
//     [EDIT_PASSWORD_ROUTE]: {
//       screen: EditPassword,
//     },
//     [EDIT_CC_ROUTE]: {
//       screen: EditCC,
//     },
//     [CLASS_INFO_ROUTE]: {
//       screen: ClassDetail,
//     },
//   },
//   {
//     headerMode: 'none',
//     initialRouteName: token ? DRAWER_ROUTE : LANDING_ROUTE,
//     navigationOptions: {
//       gestureEnabled: true,
//     },
//   }
// );

/**
 * @class Navigator
 * @extends Component
 */
class Navigator extends Component {
  /**
   * @constructor
   * @constructs Navigator
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      attempted: false,
      token: null,
    };
    this.checkAuth = this.checkAuth.bind(this);
  }
  /**
   * @returns {undefined}
   */
  componentDidUpdate() {
    this.checkAuth();
  }
  /**
   * @returns {undefined}
   */
  async checkAuth() {
    if (this.state.attempted) {
      return;
    }
    this.setState({
      token: await AsyncStorage.getItem(Config.USER_TOKEN_KEY),
      attempted: true,
    });
  }
  /**
   * @returns {JSX} XML
   */
  render() {
    console.log(`\n\nIn app router`);
    console.log(`userToken => ${this.props.userToken}`);
    const Nav = (myStack(this.props.userToken));
    console.log(`\n\nmade it past createAppContainer`);
    return <Nav screenProps={{ isLoading: false }} />;
  }
}

Navigator.propTypes = {
  userToken: PropTypes.string,
};

export default Navigator;
