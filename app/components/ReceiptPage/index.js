import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDetailedConfirmationEvents, getDetailedConfirmationPackages, getDetailedConfirmationCredits } from '../../selectors';
import { clearConfirmation } from '../../actions';
import { PaginatedSlider, FadeInView } from '../shared';
import Header from '../Header';

/**
 * @class ReceiptPage
 * @extends {Component}
 */
class ReceiptPage extends Component {
  /**
   * @constructor
   * @constructs ReceiptPage
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
  }
  /**
   * @returns {JSX} XML
   */
  componentWillUnmount() {
    this.props.clearConfirmation();
  }
  /**
   * @returns {JSX} XML
   */
  render() {
    console.log(`\n\n\nDO I MAKE IT TO THE RECEIPT PAGE EVER?`);
    // next up --> test whether the props are good
    // then bring in the fadeinview and all of the other stuff
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#6fbf98'}}>
        <Text>This is the receipt page</Text>
        <Button 
          title="Click here to go to the email page"
          onPress={() => this.props.navigation.navigate(VERIFY_ROUTE)}
          />
      </View>
  );
    // return (
    //   <FadeInView>
    //     <Header title="Order Summary" />
    //     <PaginatedSlider
    //       forReceiptPage
    //       credits={this.props.credits}
    //       packages={this.props.packages}
    //       events={this.props.events}
    //     />
    //   </FadeInView>
    // );
  }
}

ReceiptPage.propTypes = {
  credits: PropTypes.arrayOf(PropTypes.shape()),
  packages: PropTypes.arrayOf(PropTypes.shape()),
  events: PropTypes.arrayOf(PropTypes.shape()),
  clearConfirmation: PropTypes.func,
};

const mapStateToProps = state => ({
  // testing: 1,
  credits: getDetailedConfirmationCredits(state),
  packages: getDetailedConfirmationPackages(state),
  events: getDetailedConfirmationEvents(state),
});

const mapDispatchToProps = {
  clearConfirmation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptPage);
