import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components';
import * as Font from 'expo-font';

import Config from './config.json';
import LinearLoader from './app/components/shared/LinearLoader';

import StudioFont from './assets/fonts/Regular.ttf';
import StudioFontHeavy from './assets/fonts/Bold.ttf';

const StyledLoadingPage = styled.View`
  align-items: center;
  background: ${Config.STUDIO_COLOR};
  justify-content: center;
  flex: 5;
`;

/**
 * @class App
 * @extends Component
 */
class App extends Component {
  /**
   * @constructor
   * @constructs App
   */
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      fetchedAssets: false,
      imageLoaded: false,
      errorOccured: false,
      appState: AppState.currentState,
    }
    this.onAppStateChange = this.onAppStateChange.bind(this);
    AppState.addEventListener('change', this.onAppStateChange);
    
  }
  /**
  * @returns {undefined}
  */
 async getFonts() {
  await Font.loadAsync({
    'studio-font': StudioFont,
    'studio-font-heavy': StudioFontHeavy,
  });
  this.setState({ fontLoaded: true });
  }
  /**
   * @returns {undefined}
   */
  async getAssets() {
    
    try {
      console.log('inside of getAssets()');
      // const token = await AsyncStorage.getItem(Config.USER_TOKEN_KEY);
      // let studioData = await AsyncStorage.getItem(Config.STUDIO_DATA_KEY);

      // if (studioData && studioData.length && !isFlexStudios) {
      //   studioData = JSON.parse(studioData);
      //   store.dispatch(setStudio(studioData));
      // } else await store.dispatch(requestStudioData(false, flexLocation));

      // if (token) {
      //   await store.dispatch(requestUserData());
      // }

      // this.setState({ fetchedAssets: true, userToken: token });
      // if (await AsyncStorage.getItem(Config.STUDIO_DATA_KEY)) await store.dispatch(requestStudioData(false, flexLocation));
      // if (token) {
      //   await store.dispatch(syncUserEvents());
      //   await store.dispatch(syncUserPasses());
      // }
    } catch (err) {
      // AsyncStorage.clear();
      // store.dispatch(logFatalError(err));
      // Sentry.captureException(new Error(err.message), { logger: 'my.module' });
      this.setState({ fetchedAssets: false, errorOccurred: true });
    }
  }
  /**
   * @returns {undefined}
   */
  async componentDidMount() {
    await this.getFonts();
    await this.getAssets();
  }
  componentWillUnmount() {
    clearInterval(this.eventRefreshInterval);
    AppState.removeEventListener('change', this.onAppStateChange);
  }
  /**
   * @param {string} nextAppState after it changes
   * @returns {undefined}
   */
  onAppStateChange(nextAppState) {
    console.log('inside of onAppStateChange');
    // if (getUserIsResettingPassword(store.getState())) return;
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // this.getUpdates();
      this.setState({ fetchedAssets: false }, () => this.getAssets());
    }
    this.setState({ appState: nextAppState });
  }
  

  render() {
    console.log('testing here');
    console.log(`fontLoaded => ${this.state.fontLoaded}`);
    console.log(`appState: ${this.state.appState}`);
    console.log(`fetchedAssets: ${this.state.fetchedAssets}`);
    console.log(`imageLoaded: ${this.state.imageLoaded}`);
    return (
      <View style={{ flex: 1}}>  
        <StyledLoadingPage>
          {/* <Text>Alicia App</Text> */}
          <LinearLoader showQuote={this.state.fontLoaded} />
        </StyledLoadingPage>
      </View>
    );
  }
}
export default App;