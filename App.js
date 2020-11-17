import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components';

import Config from './config.json';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Hello World!!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

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
    
  }
  render() {
    console.log('testing here');
    return (
      <View style={{ flex: 1}}>  
        <StyledLoadingPage>
          <Text>Alicia App</Text>
        </StyledLoadingPage>
      </View>
    );
  }
}
export default App;