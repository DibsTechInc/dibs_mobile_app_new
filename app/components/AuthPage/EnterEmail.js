import React, {Component} from 'react';
import { ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Config from '../../../config.json';
import {
  FadeInView,
  InputField,
  MaterialButton,
} from '../shared';

import { validateEmail } from '../../actions/UserActions';

import {
  LANDING_ROUTE,
} from '../../constants/RouteConstants';


class EnterEmail extends Component {
  /**
     * @constructor
     * @cosntructs LandingPage
     * @param {Object} props for component 
     */
    constructor(props) {
      super(props);
    }
    render() {
      console.log('I am in the verify route');
      return (
          <FadeInView>
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '70%', position: 'relative'}}>
            <InputField
              customFocus
              label="What's your email?"
              autoCapitalize="none"
              containerStyle={{
                marginBottom: 50,
                width: 200,
              }}
              labelStyle={{ marginBottom: 20, textAlign: 'center' }}
            />
            </ScrollView>
          </FadeInView>
      );

    }
}

EnterEmail.propTypes = {
  navigation: PropTypes.shape(),
};

EnterEmail.navigationOptions = {
  headerMode: 'none',
};

const mapDispatchToProps = {
  validateEmail,
};

export default connect(null, mapDispatchToProps)(EnterEmail);