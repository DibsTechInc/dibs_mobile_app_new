import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
// import { NavigationActions, StackActions, withNavigation } from '@react-navigation/compat';
import { Svg, Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import { isIphoneX } from 'react-native-iphone-x-helper';

import backgroundImg from '../../../assets/img/main-page.png';
import {
  BLACK,
  WHITE,
  LIGHT_GREY,
  SCHEDULE_ROUTE,
  PROFILE_ROUTE,
  UPCOMING_CLASS_ROUTE,
  HEIGHT,
  WIDTH,
  DARK_TEXT_GREY,
  DRAWER_OPEN,
} from '../../constants';
import {
  getUserFirstName,
  getStudioName,
  getUserHasUpcomingEvents,
} from '../../selectors';
import {
  FadeInView,
  CustomStatusBar,
  BurgerIcon,
  CartIcon,
  CalendarIcon,
  UserIcon,
  ActivityIcon,
} from '../shared';
import { enqueueNotice } from '../../actions';
import { HeavyText, FlexRow, SpaceBetweenRow } from '../styled';
import IconLink from './IconLink';
import UpcomingEventSlider from './UpcomingEventSlider';
import Config from '../../../config.json';
import { LANDING_ROUTE } from '../../constants/RouteConstants';

const BackgroundImage = styled.Image`
  left: 0;
  width: ${WIDTH};
  height: ${HEIGHT};
  opacity: 0.35;
  position: absolute;
  right: 0;
  top: 0;
`;

const MainPageHeader = styled(SpaceBetweenRow)`
  align-items: center;
  margin-top: ${isIphoneX() * 15};
`;

const Content = styled.View`
  flex: 1;
  justify-content: ${props => (props.hasUpcomingClasses ? 'center' : 'flex-end')};
  margin-bottom: ${props => (props.hasUpcomingClasses ? 190 : (HEIGHT / 10))};
  padding-horizontal: ${WIDTH / 10};
`;

const Greeting = styled(HeavyText)`
  color: ${WHITE};
  font-size: 32;
`;

const Welcome = styled.Text`
  color: ${LIGHT_GREY};
  font-size: 16;
  font-family: 'studio-font';
`;

const IconRow = styled(FlexRow)`
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 15;
  position: relative;
  width: 100%;
`;

const IconBorder = () => (
  <Svg width={2} height={50}>
    <Defs>
      <LinearGradient id="linear_grad" x1="0" y1="0" x2="0" y2="100%">
        <Stop offset="0%" stopColor={DARK_TEXT_GREY} />
        <Stop offset="50%" stopColor={WHITE} />
        <Stop offset="100%" stopColor={DARK_TEXT_GREY} />
      </LinearGradient>
    </Defs>
    <Path stroke="url(#linear_grad)" d="M 1 0 L 1 50" strokeWidth="1" fillRule="nonzero" />
  </Svg>
);

/**
 * @class MainPage
 * @extends {React.PureComponent}
 */
class MainPage extends React.PureComponent {
  /**
   * @constructor
   * @constructs MainPage
   */
  constructor() {
    super();
    this.navigateToDrawer = this.navigateToDrawer.bind(this);
    this.checkIfLoggedIn();
  }
  /**
   * @returns {undefined}
   */
  async checkIfLoggedIn() {
    console.log(`\n\n`);
    console.log('checkIfLoggedIn');
    const token = await AsyncStorage.getItem(Config.USER_TOKEN_KEY);
    console.log(`registering token again ==> ${token}`);
    if (!token) {
      console.log(`no token so --> ${LANDING_ROUTE}`);
      console.log(`navigation --> ${this.props.navigation}`);
      this.props.navigation.navigate(LANDING_ROUTE);
    }
  }
  /**
   * @returns {undefined}
   */
  navigateToDrawer() {
    console.log('navigateToDrawer');
    console.log(`\n\nprops ==> ${JSON.stringify(this.props)}`);

    const keyType = this.props.route.key.split('-')[0];
    console.log(`keyType is ${keyType}`);
    if (keyType === 'id') {
      this.props.navigation.pop();
    } else {
      // this.props.navigation.openDrawer();
      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    }
  }
  /**
   * render
   * @returns {JSX.Element} XML
   */
  render() {
    console.log(`\n\nMAIN PAGE SON!!!! THIS IS THE ONE TO FOCUS ON FOR NOW`);
    console.log('this is the main page v1');
    console.log(`\n\nhasUpcomingClasses ==> ${this.props.hasUpcomingClasses}`);
    console.log(`\nfirstname = ${this.props.userFirstName}`);
    console.log(`\nstudioName: ${this.props.studioName}`);
    
    return (
      <FadeInView style={{ position: 'relative', backgroundColor: BLACK }}>
        <CustomStatusBar backgroundColor={'transparent'} barStyle="light-content" />
        <BackgroundImage source={backgroundImg} />
        <MainPageHeader>
          <BurgerIcon onPress={this.navigateToDrawer} style={{ marginLeft: 10, padding: 10 }} />
          <CartIcon iconColor={WHITE} />
        </MainPageHeader>
        <Content hasUpcomingClasses={this.props.hasUpcomingClasses}>
          <Greeting numberOfLines={1}>
            Hi {this.props.userFirstName}!
          </Greeting>
          <Welcome>
            Welcome to {this.props.studioName}
          </Welcome>
          <IconRow>
            <IconLink
              text="BOOK"
              route={SCHEDULE_ROUTE}
              alignItems="flex-start"
              renderIcon={() => <ActivityIcon />}
            />
            <IconBorder />
            <IconLink
              text={'MY CALENDAR'}
              route={UPCOMING_CLASS_ROUTE}
              alignItems="center"
              renderIcon={() => <CalendarIcon />}
            />
            <IconBorder />
            <IconLink
              text="ACCOUNT"
              route={PROFILE_ROUTE}
              alignItems="flex-end"
              renderIcon={() => <UserIcon />}
            />
          </IconRow>
        </Content>
        {this.props.hasUpcomingClasses ? <UpcomingEventSlider /> : null}
      </FadeInView>
    );
  }
}

MainPage.propTypes = {
  userFirstName: PropTypes.string.isRequired,
  studioName: PropTypes.string.isRequired,
  hasUpcomingClasses: PropTypes.bool.isRequired,
  navigation: PropTypes.shape(),
  enqueueNotice: PropTypes.func,
};

const mapStateToProps = state => ({
  userFirstName: getUserFirstName(state),
  studioName: getStudioName(state),
  hasUpcomingClasses: getUserHasUpcomingEvents(state),
});
const mapDispatchToProps = {
  enqueueNotice,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
