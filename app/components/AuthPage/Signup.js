import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Sentry from 'sentry-expo';
import PropTypes from 'prop-types';

import {
  View,
  ScrollView,
} from 'react-native';
import styled from 'styled-components';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { promisify } from 'bluebird';

import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';

import { signUpUser, enqueueUserError } from '../../actions';
import { MaterialButton, CustomStatusBar, FadeInView, InputField } from '../shared';
import {
  MAIN_ROUTE,
  LOGIN_ROUTE,
  DEFAULT_BG,
  HEIGHT,
  WIDTH,
  RED,
} from '../../constants';
import {
  getStudioName,
  getStudioSource,
  getStudioId,
  getDibsStudioId,
} from '../../selectors';
import Config from '../../../config.json';
import LinearLoader from '../shared/LinearLoader';
import TermsCheckBox from './TermsCheckBox';

import { NormalText } from '../styled';

const StyledButtonView = styled.View`
  padding: 8px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled(NormalText)`
  margin-bottom: 7%;
  font-size: ${WIDTH < 400 ? 13 : 16}
`;


/**
 * @class Signup
 * @extends PureComponent
 */
class Signup extends PureComponent {
  /**
   * @constructor
   * @constructs Signup
   * @param {Object} props for component
   */
  constructor() {
    super();

    this.state = {
      fullName: '',
      password: '',
      tAndC: false,
      // errorMessage: '',
      isLoading: false,
      cca2: 'US',
      formEmptyError: '',
      nameError: '',
      passwordError: '',
      tAndCError: '',
      phoneError: '',
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);

    this.handleOnPress = this.handleOnPress.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.handleOnCheck = this.handleOnCheck.bind(this);
  }

  /**
   * @returns {undefined}
   */
  componentDidMount() {
    this.setState({ pickerData: this.phone.getPickerData() }); // eslint-disable-line
  }

  /**
   * @returns {undefined}
   */
  onPressFlag() {
    this.countryPicker.openModal();
  }
  /**
   * @returns {undefined}
   */
  setErrorMessages() {
    const { formInfo } = this.checkForm();

    const {
      isValidFullName,
      isValidPassword,
      tAndC,
      isValidPhoneNumber,
    } = formInfo;

    this.setState({
      nameError: isValidFullName ? '' : 'Please enter a first and last name',
      passwordError: isValidPassword ? '' : 'Password must be 6 characters',
      phoneError: isValidPhoneNumber ? '' : 'Invalid phone number',
      tAndCError: tAndC ? '' : 'Please agree to terms and conditions',
    });
  }

  /**
   * @returns {undefined}
   */
  async handleOnPress() {
    const { isValid } = this.checkForm();
    this.setErrorMessages();

    if (isValid) {
      const phone = this.phone.getValue();

      const payload = {
        // email: this.props.navigation.state.params.email,
        email: this.props.route.params,
        fullname: this.state.fullName,
        password: this.state.password,
        phone,
        signupStudioId: this.props.studioId,
        signupStudioSource: this.props.studioSource,
        referredBy: undefined,
        signupDibsStudioId: this.props.dibsStudioId,
        attempt: 0,
      };

      this.setState({ isLoading: true });
      try {
        await promisify(this.props.signUpUser.bind(this, payload))();
        return this.props.navigation.navigate(MAIN_ROUTE);
      } catch (err) {
        console.log(err);
        Sentry.captureException(new Error(err.message), { logger: 'my.module' });
        this.setState({ isLoading: false });
        if (err.message === 'Account disabled') {
          return this.props.navigation.navigate(LOGIN_ROUTE, { 
            accountDisabled: true, 
            // email: this.props.navigation.state.params.email,
            email: this.props.route.params.email,
           });
        }
        return null;
      }
    }
    return null;
  }

  /**
   * @returns {undefined}
   */
  handleOnCheck() {
    this.setState({
      tAndC: !this.state.tAndC,
    });
  }

  /**
   * @param{object} country picker object
   * @returns {undefined}
   */
  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  /**
 * @returns {Object} object containing canShowButton and canRegister booleans
 */
  checkForm() {
    const isValidPhoneNumber = this.phone.isValidNumber();

    const nameLength = this.state.fullName.length && this.state.fullName.split(' ').length;
    const passwordLength = this.state.password.length;
    const tAndC = this.state.tAndC;

    const isValidFullName = nameLength > 1 && nameLength <= 6;
    const isValidPassword = passwordLength >= 6;

    return {
      isValid: isValidFullName && isValidPassword && tAndC && isValidPhoneNumber,
      formInfo: { isValidFullName, isValidPassword, tAndC, isValidPhoneNumber },
    };
  }

  /**
   * @returns {JSX} XML
   */
  render() {
    if (this.state.isLoading) {
      return (
        <FadeInView style={{ justifyContent: 'center', alignItems: 'center' }}>
          <LinearLoader showQuote color={Config.STUDIO_COLOR} />
        </FadeInView>
      );
    }

    return (
      <FadeInView>
        <CustomStatusBar backgroundColor={'transparent'} barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ height: HEIGHT, marginTop: 30 }} keyboardShouldPersistTaps="always">
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
            <StyledText>
              Just a few details before we get started
            </StyledText>
            <View style={{ position: 'relative' }}>
              <InputField
                value={this.state.fullName}
                onChangeText={fullName => this.setState({ fullName })}
                placeholder="First and last name"
                containerStyle={{ marginBottom: 30, width: 250 }}
                customFocus
              />
              {this.state.nameError.length ? <NormalText style={{ color: RED, position: 'absolute', bottom: 10, fontSize: 12 }}>{this.state.nameError}</NormalText> : undefined}
            </View>
            <View style={{ position: 'relative' }}>
              <InputField
                value={this.state.password}
                secureTextEntry
                onChangeText={password => this.setState({ password })}
                placeholder="Password (6 char min)"
                containerStyle={{ marginBottom: 30, width: 250 }}
              />
              {this.state.passwordError.length ? <NormalText style={{ color: RED, position: 'absolute', bottom: 10, fontSize: 12 }}>{this.state.passwordError}</NormalText> : undefined}
            </View>
            <View style={{ position: 'relative' }}>
              <PhoneInput
                ref={(ref) => {
                  this.phone = ref;
                }}
                onPressFlag={this.onPressFlag}
                textStyle={{ fontFamily: 'studio-font' }}
                textProps={{ placeholder: 'Mobile number' }}
                style={{ width: 250, borderBottomWidth: 1, paddingBottom: 5, marginTop: 10, marginBottom: 30, borderBottomColor: Config.STUDIO_COLOR }}
              />
              <CountryPicker
                ref={(ref) => {
                  this.countryPicker = ref;
                }}
                onChange={value => this.selectCountry(value)}
                translation="eng"
                cca2={this.state.cca2}
                closeable
                filterable
                styles={{
                  countryName: { fontFamily: 'studio-font' },
                  input: { fontFamily: 'studio-font' },
                  letterText: { fontFamily: 'studio-font' },
                }}
              >
                <View />
              </CountryPicker>
              {this.state.phoneError.length ? <NormalText style={{ color: RED, position: 'absolute', bottom: 10, fontSize: 12 }}>{this.state.phoneError}</NormalText> : undefined}
            </View>
            <TermsCheckBox
              studioName={this.props.studioName}
              tAndC={this.state.tAndC}
              tAndCError={this.state.tAndCError}
              onPress={this.handleOnCheck}
            />
          </View>
        </ScrollView>
        <KeyboardAccessoryView
          alwaysVisible
          hideBorder
          style={{ backgroundColor: DEFAULT_BG, marginBottom: 25 }}
        >
          <StyledButtonView>
            <MaterialButton
              onPress={this.handleOnPress}
              text="Register"
              style={{ width: '75%', height: 40 }}
            />
          </StyledButtonView>
        </KeyboardAccessoryView>
      </FadeInView>
    );
  }
}

Signup.propTypes = {
  navigation: PropTypes.shape().isRequired,
  studioName: PropTypes.string.isRequired,
  signUpUser: PropTypes.func.isRequired,
  studioSource: PropTypes.string.isRequired,
  studioId: PropTypes.number.isRequired,
  dibsStudioId: PropTypes.number.isRequired,
  enqueueUserError: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  studioName: getStudioName(state),
  studioSource: getStudioSource(state),
  studioId: getStudioId(state),
  dibsStudioId: getDibsStudioId(state),
});

const mapDispatchToProps = {
  signUpUser,
  enqueueUserError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

