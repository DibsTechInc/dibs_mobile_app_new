// import * as React from 'react';


// import Config from './config.json';
import LandingPage from '../components/LandingPage';
// import LinearLoader from './app/components/shared/LinearLoader';
import EnterEmail from '../components/AuthPage/EnterEmail';
import EnterPassword from '../components/AuthPage/EnterPassword';
import MainPage from '../components/MainPage';
import SchedulePage from '../components/SchedulePage';
import UpcomingClassesPage from '../components/UpcomingClassesPage';
import ProfilePage from '../components/ProfilePage/ProfilePage';
import EditUserName from '../components/ProfilePage/EditUserName';
import EditEmail from '../components/ProfilePage/EditEmail';
import EditPassword from '../components/ProfilePage/EditPassword';
import UserSettings from '../components/ProfilePage/UserSettings';
import EditCC from '../components/ProfilePage/EditCC';
import TermsAndConditions from '../components/AuthPage/TermsAndConditions';

import Config from '../../config.json';
import {
  LANDING_ROUTE,
  VERIFY_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  SCHEDULE_ROUTE,
  UPCOMING_CLASS_ROUTE,
  PROFILE_ROUTE,
  EDIT_USERNAME_ROUTE,
  EDIT_EMAIL_ROUTE,
  EDIT_PASSWORD_ROUTE,
  EDIT_CC_ROUTE,
  SETTINGS_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
} from '../constants/RouteConstants';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    const initialRoute = `${this.state.userToken ? LANDING_ROUTE : VERIFY_ROUTE}`;
    return (
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
            <Stack.Screen name={SCHEDULE_ROUTE} component={SchedulePage}/>
            <Stack.Screen name={UPCOMING_CLASS_ROUTE} component={UpcomingClassesPage}/>
            <Stack.Screen name={PROFILE_ROUTE} component={ProfilePage}/>
            <Stack.Screen name={EDIT_USERNAME_ROUTE} component={EditUserName}/>
            <Stack.Screen name={EDIT_EMAIL_ROUTE} component={EditEmail}/>
            <Stack.Screen name={EDIT_PASSWORD_ROUTE} component={EditPassword}/>
            <Stack.Screen name={SETTINGS_ROUTE} component={UserSettings}/>
            <Stack.Screen name={EDIT_CC_ROUTE} component={EditCC}/>
            <Stack.Screen name={TERMS_AND_CONDITIONS_ROUTE} component={TermsAndConditions}/>
        </Stack.Navigator>
    );
};

export { MainStackNavigator };