import React, { PureComponent } from 'react';
import { ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Promise from 'bluebird';
import styled from 'styled-components';

import Config from '../../../config.json';
import {
  FadeInView,
  InputField,
  MaterialButton,
} from '../shared';

import { validateEmail } from '../../actions/UserActions';

import {
  LANDING_ROUTE,
  LOGIN_ROUTE,
  LOGIN_STACK_ROUTE,
} from '../../constants/RouteConstants';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { DEFAULT_BG } from '../../constants';

const StyledButtonView = styled.View`
  padding: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;


class EnterEmail extends PureComponent {
  /**
     * @constructor
     * @cosntructs LandingPage
     * @param {Object} props for component 
     */
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        isLoading: false,
        errorText: '',
        validInput: false,
      };
      this.handleOnPress = this.handleOnPress.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
    }

    /**
     * @returns {undefined}
     */
    componentWillUnmount() {
      Keyboard.dismiss();
    }
    /**
     * @param {string} email - user email
     * @returns {undefined}
     */
    onChangeText(email) {
      this.setState({ email });
    }
    /**
     * @returns {undefined}
     */
    async handleOnPress() {
      const { email } = this.state;

      console.log(`state of this: ${JSON.stringify(this.state)}`);

      // Heavy duty regex catches most email formatting errors
      const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValidEmail = validEmail.test(email);

      console.log(`validEmail = ${validEmail}`);
      console.log(`isValidEmail = ${isValidEmail}`);

      if (!isValidEmail) {
        this.setState({ errorText: 'Please enter a valid email address.' });
        return;
      }

      await new Promise(res => this.setState({ isLoading: true, validInput: true }, res));
      const route = await this.props.validateEmail(email);
      
      if (!route) {
        this.setState({ isLoading: false, errorText: 'Please enter a valid email address.'});
        this.props.screenProps.isLoading = false;
      } else {
        // this.props.navigation.navigate(route, { email, fromReset: false });
        this.props.navigation.navigate(LOGIN_STACK_ROUTE, {
          screen: route,
          params: {
            email,
            fromReset: false,
          },
        });
      }
   
    }

    /**
     * @returns {JSX} XML
     */

    render() {
      console.log('I am in the verify route');
      return (
          <FadeInView>
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '70%', position: 'relative'}}>
              <InputField
                customFocus
                label="What's your email?"
                onChangeText={this.onChangeText}
                onSubmitEditing={this.handleOnPress}
                value={this.state.email}
                autoCapitalize="none"
                containerStyle={{
                  marginBottom: 50,
                  width: 200,
                }}
                labelStyle={{ marginBottom: 20, textAlign: 'center' }}
                blurOnSubmit={this.state.validInput}
              />
            </ScrollView>
            <KeyboardAccessoryView
            alwaysVisible
            hideBoarder
            style={{ backgroundColor: DEFAULT_BG, margineBottom: 25 }}
            >
              <StyledButtonView>
                <MaterialButton
                  onPress={this.handleOnPress}
                  text="Next"
                  style={{ width: '75%', height: 40 }}
                />
              </StyledButtonView>
            </KeyboardAccessoryView>
          </FadeInView>
      );

    }
}

EnterEmail.propTypes = {
  navigation: PropTypes.shape(),
};

// EnterEmail.navigationOptions = {
//   headerMode: 'none',
// };

const mapDispatchToProps = {
  validateEmail,
};

export default connect(null, mapDispatchToProps)(EnterEmail);