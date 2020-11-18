import React, { PureComponent } from 'react';
import { ScrollView, Keyboard } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Promise } from 'bluebird';
import styled from 'styled-components';

import {
  FadeInView,
  InputField,
  LinearLoader,
  MaterialButton,
} from '../shared';
import { validateEmail } from '../../actions/UserActions';

import { DEFAULT_BG } from '../../constants';
import Config from '../../../config.json';

import {
  NormalText,
  FlexCenter,
} from '../styled';

const StyledButtonView = styled.View`
  padding: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled(NormalText)`
  fontSize: 12px;
  color: red;
  position: absolute;
  top: 52%;
`;

/**
 * @class EnterEmail
 * @extends Component
 */
class EnterEmail extends PureComponent {
  /**
 * @constructor
 * @constructs EnterEmail
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
    console.log('inside of enterEmail');

    // Heavy duty regex catches most email formatting errors
    const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = validEmail.test(email);

    if (!isValidEmail) {
      this.setState({ errorText: 'Please enter a valid email address.' });
      return;
    }
    await new Promise(res => this.setState({ isLoading: true, validInput: true }, res));
    const route = await this.props.validateEmail(email);

    Promise.delay(2000).then(function() {
      console.log("20001 ms passed");
      return Config.LOADING_QUOTES?.length;
      }).delay(2000).then(function(loadingquotes) {
        console.log(loadingquotes);
        console.log("another 2000 ms passed") ;
      });

    // await Promise.delay(Config.LOADING_QUOTES?.length && 2000);
    
    console.log('made it past that Promise.delay');
    await new Promise(res => this.setState({ isLoading: false, errorText: '' }, res));

    if (!route) {
      this.setState({ isLoading: false, errorText: 'Please enter a valid email provider.' });
      this.props.screenProps.isLoading = false;
    } else {
      this.props.navigation.navigate(route, { email, fromReset: false }); // last key for PW reset
    }
  }
  /**
   * @returns {JSX} XML
   */
  render() {
    if (this.state.isLoading) {
      return (
        <FadeInView style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FlexCenter>
            <LinearLoader showQuote color={Config.STUDIO_COLOR} />
          </FlexCenter>
        </FadeInView>
      );
    }
    return (
      <FadeInView>
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height: '70%', position: 'relative' }}>
          <InputField
            customFocus
            label="What's your email?"
            autoCapitalize="none"
            onChangeText={this.onChangeText}
            onSubmitEditing={this.handleOnPress}
            value={this.state.email}
            containerStyle={{
              marginBottom: this.state.emailError ? 10 : 50,
              width: 200,
            }}
            labelStyle={{ marginBottom: 20, textAlign: 'center' }}
            blurOnSubmit={this.state.validInput}
          />
          {this.state.errorText.length ? <ErrorText>{this.state.errorText}</ErrorText> : undefined}
        </ScrollView>
        <KeyboardAccessoryView
          alwaysVisible
          hideBorder
          style={{ backgroundColor: DEFAULT_BG, marginBottom: 25 }}
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

const mapDispatchToProps = {
  validateEmail,
};


export default connect(null, mapDispatchToProps)(EnterEmail);
