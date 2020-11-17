import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, AppState } from 'react-native';
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
      appState: AppState.currentState,
    }
    // this.onAppStateChange = this.onAppStateChange.bind(this);
    // AppState.addEventListener('change', this.onAppStateChange);
    
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
  async componentDidMount() {
    await this.getFonts();
  }
  

  render() {
    console.log('testing here');
    console.log(`fontLoaded => ${this.state.fontLoaded}`);
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