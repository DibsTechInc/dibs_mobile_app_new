import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { withNavigation, NavigationActions } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from 'react-native-modalbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FadeInView from '../shared/FadeInView';

import {
  getFormattedCartValueBack,
  getConfirmationItems,
  getCartValueBack,
  getFormattedCartTotal,
  getCartIsPurchasing,
  getDetailedCartEvents,
  getSortedCartPackages,
  getCCExpMonth,
  getCCIsLoading,
  getEventsCurrentSpotBookingEventId,
  getStudioHasSpotBooking,
  getLastRoomSpot,
  getDetailedCartCredits,
  getUserHasPasses,
  getStudioSpotLabel,
} from '../../selectors';

import {
  enqueueNotice,
  setCartEventsData,
  clearPromoCodeData,
  submitCartForPurchase,
  setCurrentSpotBookingEventId,
} from '../../actions';

import {
  LIGHT_GREY,
  WHITE,
  BLACK,
  RECEIPT_ROUTE,
  GREY,
  HEIGHT,
} from '../../constants';

import {
  LinearLoader,
  PaymentInfo,
  EventListItem,
  SwipableButton,
  PackageItem,
  CreditLoadItem,
} from '../shared';

import { NormalText, FlexCenter } from '../styled';

import CartTransaction from './CartTransaction';
import PromoField from './PromoField';
import Config from '../../../config.json';
import NoItems from './NoItems';
import Header from '../Header';
import SpotBookingPage from '../SpotBookingPage';

const CheckoutView = styled.View`
  justify-content: space-between;
  align-items: center;
  border-top-width: 1;
  border-color: ${LIGHT_GREY};
  elevation: 3;
  background-color: ${WHITE};
  shadow-color: ${BLACK};
  shadow-opacity: 0.02;
  elevation: 3;
`;

const SavingsText = styled(NormalText)`
  color: ${BLACK};
`;

/**
 * @class CartPage
 * @extends {Component}
 */
class CartPage extends PureComponent {
  /**
   * @static
   * @param {Object} props to test
   * @param {Object} state to test
   * @returns {boolean} if ready for purchase
   */
  static getIsReadyForPurchase(props, state) {
    return props.creditCardExpMonth && (!props.creditCardLoading) && (!state.isUpdatingCard);
  }
  /**
   * @constructor
   * @constructs CartPage
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      isUpdatingCard: false,
      isProcessingPayment: false,
    };

    this.toPreviousPage = this.toPreviousPage.bind(this);
    this.setEditCC = this.setEditCC.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.closePickingSpotsModal = this.closePickingSpotsModal.bind(this);
    this.clearEvents = this.clearEvents.bind(this);
  }

  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    // await this.props.getConfirmationItems();
    if (this.props.events.length && this.props.packages.length) {
      this.props.enqueueNotice({
        title: 'Keep classes in your cart?',
        message: 'Packages in your cart will not apply to the classes.',
        buttons: [
          { text: 'REMOVE', onPress: this.clearEvents },
          { text: 'KEEP', onPress: () => { } },
        ],
      });
    }
  }
  // trying this out
  /**
   * @param {Object} props previous props
   * @returns {undefined}
   */
  async UNSAFE_componentWillReceiveProps(props) {
    if (
      (this.props.events.length || this.props.packages.length)
      && !props.events.length
      && !props.packages.length
    ) {
      this.props.clearPromoCodeData();
    }
    if (this.props.confirmedPurchases.length) {
      this.props.navigation.navigate('NavigationStack', { screen: 'Receipt' }); 

    } else if (this.props.purchasing && !props.purchasing) {
      this.endPurchase();
    } 
  }
  // remove depracated function
  // /**
  //  * @param {Object} props previous props
  //  * @returns {undefined}
  //  */
  // componentWillReceiveProps(props) {
  //   // alicia - getting error here WillReceiveProps
  //   // move this to something else - componentDidUpdate or something else
  //   // other error is the receipt route - it causes the app to crash
  //   if (
  //     (this.props.events.length || this.props.packages.length)
  //     && !props.events.length
  //     && !props.packages.length
  //   ) {
  //     this.props.clearPromoCodeData();
  //   }
  //   console.log('inside of willReceiveProps');
  //   console.log(`\n\nin componentWillReceiveProps v2 this.props --> ${JSON.stringify(this.props)}`);
  //   console.log(`\n\nAnd props are v2: ${JSON.stringify(props)}\n\n`);
  //   if (props.confirmedPurchases.length) {
  //     console.log('sending to the receipt Page');
  //     // alicia - the problem is definitely the route - yay!
  //     // this.props.navigation.navigate(RECEIPT_ROUTE);
  //     // figure out the correct route and make that work. phew!
  //   } else if (this.props.purchasing && !props.purchasing) {
  //     console.log('about to endPurchase');
  //     this.endPurchase();
  //   } else {
  //     console.log('I have nothing else to say');
  //   }
  // }
  /**
   * @returns {undefined}
   */
  componentWillUnmount() {
    if (this.swipeAnimInterval) clearInterval(this.swipeAnimInterval);
  }
  /**
   * @param {bool} bool the state of the editing
   * @returns {undefined}
   */
  setEditCC() {
    this.setState({
      isUpdatingCard: !this.state.isUpdatingCard,
    });
  }
  /**
  * @returns {undefined}
  */
  handlePurchase() {
    console.log('i am aiming to handle purchase now');
    this.setState({ isProcessingPayment: true });
    this.props.submitCartForPurchase();
  }
  /**
   * @returns {undefined}
   */
  endPurchase() {
    this.setState({ isProcessingPayment: false });
  }
  /**
   * @returns {undefined}
   */
  closePickingSpotsModal() {
    this.props.setCurrentSpotBookingEventId(null);
  }
  /**
     * @returns {undefined}
     */
  clearEvents() {
    this.props.setCartEventsData([]);
  }
  /**
   * @returns {undefined}
   */
  toPreviousPage() {
    // prob need to change this
    // console.log(`\n\nKeyType ---> ${this.props}`);
    let previousRoute = this.props.navigation.state.params && this.props.navigation.state.params.previousRoute;

    if (!previousRoute) {
      const navigateAction = NavigationActions.navigate({
        routeName: 'DrawerOpen',
      });

      this.props.navigation.dispatch(navigateAction);
      return;
    }

    const keyType = this.props.navigation.state.key.split('-')[0];
    const previousRouteKeyType = previousRoute.split('-')[0];

    if (previousRouteKeyType === 'id') {
      previousRoute = 'DrawerOpen';
    }

    if (keyType === 'id') {
      previousRoute = 'Main';
    }

    const navigateAction = NavigationActions.navigate({
      routeName: previousRoute,
    });

    this.props.navigation.dispatch(navigateAction);
  }
  /**
   * @returns {JSX} XML
   */
  render() {
    const renderValueBackMessage = this.props.valueBack > 0 ?
      `Book now and earn ${this.props.formattedValueBack} in credit back`
      : `${this.props.events.length ? 'Book' : 'Buy'} now for ${this.props.formattedCartTotal}`;

    const notReadyForPurchase = !CartPage.getIsReadyForPurchase(this.props, this.state);

    console.log(`\n\nnotReadyForPurchase = ${notReadyForPurchase}\n\n`);

    const renderPurchaseButton = (
      <SwipableButton
        swipeText="Swipe from left to right to pay"
        notReadyForPurchase={!this.props.userHasPasses && notReadyForPurchase}
        onLeftButtonsActivate={this.handlePurchase}
      />
    );

    const renderCreditTiers = !!this.props.credits.length &&
      (<View>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: GREY, fontFamily: 'studio-font-heavy' }}>
            Credits
          </Text>
        </View>
        {this.props.credits.map(creditTier => (
          <CreditLoadItem
            key={creditTier.id}
            {...creditTier}
            isCartPage
          />
        ))}
      </View>);


    const renderCartPackages = !!this.props.packages.length &&
      (<View>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: GREY, fontFamily: 'studio-font-heavy' }}>
            Packages
        </Text>
        </View>
        {this.props.packages.map(pkg => (
          <PackageItem
            key={pkg.id}
            {...pkg}
            isCartPage
            hasPackages={Boolean(this.props.packages.length)}
          />
        ))}
      </View>);

    const renderCartEvents = !!this.props.events.length &&
      (<View>
        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: GREY, fontFamily: 'studio-font-heavy' }}>
            Classes
        </Text>
        </View>
        {this.props.events.map(item => (
          <EventListItem
            key={item.eventid}
            isCartEvent
            cartItem={item}
            studioHasSpotBooking={this.props.studioHasSpotBooking}
            lastRoomSpot={this.props.lastRoomSpot}
            studioSpotLabel={this.props.studioSpotLabel}
            {...item}
          />
        ))}
      </View>);

    const renderPromoCodeField = Boolean(this.props.events.length || this.props.packages.length) ? (
      <PromoField
        events={this.props.events}
        packages={this.props.packages}
      />) : undefined;

    if (this.state.isProcessingPayment) {
      console.log('registered that i am processing a payment');
      return (
        <FadeInView style={{ backgroundColor: Config.STUDIO_COLOR }}>
          <FlexCenter>
            <LinearLoader showQuote />
          </FlexCenter>
        </FadeInView>
      );
    }

    if (
      !this.props.events.length
      && !this.props.packages.length
      && !this.props.credits.length
    ) {
      return <NoItems />;
    }
    return (
      <FadeInView style={{ backgroundColor: WHITE }}>
        <Header title="My Cart" showCart={false} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
          {renderCreditTiers}
          {renderCartPackages}
          {renderCartEvents}
          <PaymentInfo
            isUpdatingCard={this.state.isUpdatingCard}
            setEditCC={this.setEditCC}
          />
          {renderPromoCodeField}
          <CartTransaction />
        </KeyboardAwareScrollView>
        <CheckoutView>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: 15 }}>
            <SavingsText>
              {renderValueBackMessage}
            </SavingsText>
          </View>
          {renderPurchaseButton}
        </CheckoutView>
        <Modal
          isOpen={Boolean(this.props.currentSpotBookingEventId)}
          onClosed={this.closePickingSpotsModal}
          coverScreen
          style={{ height: HEIGHT, justifyContent: 'space-around', alignItems: 'center' }}
          swipeToClose={false}
        >
          <SpotBookingPage
            spotBookingOpened={Boolean(this.props.currentSpotBookingEventId)}
            closePickingSpotsModal={this.closePickingSpotsModal}
          />
        </Modal>
      </FadeInView>
    );
  }
}

CartPage.propTypes = {
  navigation: PropTypes.shape().isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  packages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  credits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formattedValueBack: PropTypes.string.isRequired,
  valueBack: PropTypes.number.isRequired,
  formattedCartTotal: PropTypes.string.isRequired,
  submitCartForPurchase: PropTypes.func,
  confirmedPurchases: PropTypes.arrayOf(PropTypes.shape()),
  purchasing: PropTypes.bool.isRequired,
  enqueueNotice: PropTypes.func.isRequired,
  setCartEventsData: PropTypes.func.isRequired,
  clearPromoCodeData: PropTypes.func.isRequired,
  currentSpotBookingEventId: PropTypes.number,
  setCurrentSpotBookingEventId: PropTypes.func,
  studioHasSpotBooking: PropTypes.bool,
  lastRoomSpot: PropTypes.shape(),
  userHasPasses: PropTypes.bool,
  studioSpotLabel: PropTypes.string,
};

const mapStateToProps = state => ({
  events: getDetailedCartEvents(state),
  packages: getSortedCartPackages(state),
  credits: getDetailedCartCredits(state),
  formattedValueBack: getFormattedCartValueBack(state),
  valueBack: getCartValueBack(state),
  formattedCartTotal: getFormattedCartTotal(state),
  confirmedPurchases: getConfirmationItems(state),
  purchasing: getCartIsPurchasing(state),
  creditCardExpMonth: getCCExpMonth(state),
  creditCardLoading: getCCIsLoading(state),
  currentSpotBookingEventId: getEventsCurrentSpotBookingEventId(state),
  studioHasSpotBooking: getStudioHasSpotBooking(state),
  lastRoomSpot: getLastRoomSpot(state),
  userHasPasses: getUserHasPasses(state),
  studioSpotLabel: getStudioSpotLabel(state),
});

const mapDispatchToProps = {
  submitCartForPurchase,
  enqueueNotice,
  setCartEventsData,
  clearPromoCodeData,
  setCurrentSpotBookingEventId,
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CartPage));
