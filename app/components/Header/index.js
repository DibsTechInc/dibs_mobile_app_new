import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from '@react-navigation/compat';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import styled from 'styled-components';
import { DrawerActions } from '@react-navigation/native';

import Config from '../../../config.json';
import { WHITE, FILTERS_SETTINGS, SCHEDULE_ROUTE } from '../../constants';
import {
  getFiltersState,
  getStudioHasMultipleLocations,
  getStudioHasSpotBooking,
  getCartEvents,
} from '../../selectors';

import {
  setUpcomingEventSliderExpandedFalse,
  setAllFilters,
  clearAllFilters,
  setCartEventsData,
} from '../../actions';
import { FlexRow, HeavyText, NormalText } from '../styled';
import { BackArrow, CustomStatusBar, CartIcon, XIcon, FiltersIcon, CheckIcon } from '../shared';

const StudioColoredTop = styled(FlexRow)`
  align-items: center;
  background-color: ${Config.STUDIO_COLOR};
  height: ${60 + (isIphoneX() ? 30 : 0)};
  justify-content: space-between;
`;

const FilterView = styled.View`
  width: 90px;
  height: 25px;
  margin: 20px 0;
  border-width: 1;
  border-color: ${WHITE};
  border-radius: 10;
  padding-right: 15px;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;

const PageTitle = styled(HeavyText)`
  color: ${WHITE};
  font-size: 16;
  text-align: center;
`;

/**
 * @class Header
 * @extends {React.PureComponent}
 */
class Header extends React.PureComponent {
  /**
   * @constructor
   * @constructs NoItems
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.handleOnCloseSaveFilter = this.handleOnCloseSaveFilter.bind(this);
    this.handleOnCloseExitFilter = this.handleOnCloseExitFilter.bind(this);
    this.handleSavedFilters = this.handleSavedFilters.bind(this);
    this.getXIconOnPressFunction = this.getXIconOnPressFunction.bind(this);
    this.getHeaderRightIcon = this.getHeaderRightIcon.bind(this);
  }
  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    this.handleSavedFilters();
  }
  /**
   * @returns {undefined}
   */
  getXIconOnPressFunction() {
    switch (true) {
      case this.props.filterSlideOpened:
        return this.handleOnCloseExitFilter();
      case this.props.spotBookingOpened:
        return this.props.closePickingSpotsModal();
      default:
        return this.props.setUpcomingEventSliderExpandedFalse();

    }
  }
  /**
 * @returns {undefined}
 */
  async handleOnCloseSaveFilter() {
    this.props.hideFilter();
    await AsyncStorage.setItem(FILTERS_SETTINGS, JSON.stringify(this.props.filters));
  }
  /**
 * @returns {undefined}
 */
  async handleOnCloseExitFilter() {
    this.props.hideFilter();
    const savedFilters = this.handleSavedFilters();
    if (!savedFilters) {
      this.props.clearAllFilters();
    }
  }
  /**
   * @returns {undefined}
   */
  goBack() {
    const {index, routes, type} = this.props.navigation.dangerouslyGetState();
    const fullData = this.props.navigation.dangerouslyGetState();
    const currentScreen = routes[index].name;
    const currentNavigatorType = type;
    // console.log(`fullData FROM BOOKING CLASS => ${JSON.stringify(fullData)}\n\n`);
    console.log('current screen', currentScreen);
    console.log(`type = ${currentNavigatorType}`);

    if (this.props.studioHasSpotBooking && this.props.cart.length) {
      this.props.setCartEventsData([]);
      return this.props.navigation.navigate(SCHEDULE_ROUTE);
    }

    if (currentNavigatorType == 'drawer') {
      console.log(`\n\n`);
      // console.log('registered that it is a drawer');
      return this.props.navigation.dispatch(DrawerActions.toggleDrawer());
    }

    if (currentScreen == 'Receipt') {
      console.log(`\n\n`);
      console.log('registered that it is the receipt page');
      return this.props.navigation.navigate('NavigationStack', { screen: 'Main' }); 
    }
    if (
      this.props.navigation.state.params
      && this.props.navigation.state.params.previousRoute
    ) {
    console.log('registered that this is the go back screen v11');
    console.log(JSON.stringify(this.props.navigation.state.params));
    return this.props.navigation.goBack();
    // return this.props.navigation.navigate(this.props.navigation.state.params.previousRoute);
    }

    // if (
    //   this.props.route.params
    //   && this.props.route.params.previousRoute
    // ) return this.props.navigation.navigate(this.props.route.params.previousRoute);
    
    // return this.props.navigation.navigate('NavigationStack', { screen: currentScreen }); 
    return this.props.navigation.goBack();

  }
  /**
   * @returns {object} filterSettings the saved filters settings
   */
  async handleSavedFilters() {
    let filterSettings = await AsyncStorage.getItem(FILTERS_SETTINGS);
    if (filterSettings && filterSettings.length) {
      filterSettings = JSON.parse(filterSettings);
      this.props.setAllFilters(filterSettings);
    }

    return filterSettings;
  }
  /**
   * @returns {undefined}
   */
  getHeaderRightIcon() {
    const {index, routes, type} = this.props.navigation.dangerouslyGetState();
    const fullData = this.props.navigation.dangerouslyGetState();
    const currentScreen = routes[index].name;
    const currentNavigatorType = type;
    // console.log(`fullData FROM BOOKING CLASS => ${JSON.stringify(fullData)}\n\n`);
    console.log('current screen', currentScreen);
    console.log(`\n\ntype = ${currentNavigatorType}\n\n`);
    let shouldHideCart = false;
    if (currentScreen == 'Receipt') {
      shouldHideCart = true;
    }
    switch (true) {
      case this.props.filterSlideOpened:
        return <CheckIcon handleOnPress={this.handleOnCloseSaveFilter} />;
      case shouldHideCart:
        return null;
      case this.props.showCart:
        return <CartIcon iconColor={WHITE} />;
      default:
        return null;
    }
  }
  /**
   * @returns {JSX.Element} XML
   */
  render() {
    const renderXIcon = this.props.upcomingEventSliderExpanded || this.props.isSliderHeader || this.props.filterSlideOpened || this.props.spotBookingOpened;

    const styleSheet = StyleSheet.create({
      container: {
        height: 80 + (isIphoneX() ? 20 : Platform.OS === 'android' ? 30 : 0),
        overflow: 'hidden',
        zIndex: 2,
        ...this.props.headerStyle
      }
    });

    const leftButton = (renderXIcon) ? (
      <View style={{ width: 30, marginLeft: 15 }}>
        <XIcon
          onPress={this.getXIconOnPressFunction}
          stroke={WHITE}
          strokeWidth={2.5}
          size={18}
        />
      </View>
    ) : (
        <BackArrow
          onPress={this.goBack}
          style={{ marginLeft: 15 }}
          stroke={WHITE}
          strokeWidth={2.5}
        />
      );

    const showFilter = this.props.studioHasMultipleLocations && this.props.hasClassFilter && !this.props.filterSlideOpened;
    return (
      <View style={styleSheet.container}>
        <CustomStatusBar backgroundColor={Config.STUDIO_COLOR} barStyle="light-content" />
        <StudioColoredTop>
          <View style={{ width: 60 }}>
            {leftButton}
          </View>
          <PageTitle>
            {this.props.title}
          </PageTitle>

          <View style={{ flexDirection: 'row' }}>
            {!!showFilter && <TouchableOpacity onPress={this.props.showFilter} style={{ width: 'auto', marginRight: 20 }}>
              <FilterView>
                <FiltersIcon />
                <NormalText style={{ color: WHITE, marginLeft: 5, marginRight: 1 }}>Filters</NormalText>
              </FilterView>
            </TouchableOpacity>}
            <View style={{ width: 60 }}>
              {this.getHeaderRightIcon()}
            </View>
          </View>
        </StudioColoredTop>
      </View>
    );
  }
}

Header.defaultProps = {
  title: '',
  isSliderHeader: false,
  hasClassFilter: false,
  hasClassHistory: false,
  showCart: true,
};

Header.propTypes = {
  navigation: PropTypes.shape().isRequired,
  title: PropTypes.string,
  upcomingEventSliderExpanded: PropTypes.bool.isRequired,
  setUpcomingEventSliderExpandedFalse: PropTypes.func.isRequired,
  isSliderHeader: PropTypes.bool,
  hasClassFilter: PropTypes.bool,
  showFilter: PropTypes.func,
  hideFilter: PropTypes.func,
  filterSlideOpened: PropTypes.bool,
  filters: PropTypes.shape(),
  setAllFilters: PropTypes.func,
  clearAllFilters: PropTypes.func,
  studioHasMultipleLocations: PropTypes.bool,
  headerStyle: PropTypes.shape(),
  closePickingSpotsModal: PropTypes.func,
  spotBookingOpened: PropTypes.bool,
  showCart: PropTypes.bool,
  studioHasSpotBooking: PropTypes.bool,
  cart: PropTypes.arrayOf(PropTypes.shape()),
  setCartEventsData: PropTypes.func,
  hasClassHistory: PropTypes.bool,
};

const mapStateToProps = state => ({
  upcomingEventSliderExpanded: state.animation.upcomingEventSliderExpanded,
  filters: getFiltersState(state),
  studioHasMultipleLocations: getStudioHasMultipleLocations(state),
  studioHasSpotBooking: getStudioHasSpotBooking(state),
  cart: getCartEvents(state),
});

const mapDispatchToProps = {
  setUpcomingEventSliderExpandedFalse,
  setAllFilters,
  clearAllFilters,
  setCartEventsData,
};

export default compose(
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps)
)(Header);
