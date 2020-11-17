import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <View>
        <Text>Alicia App</Text>
      </View>
    );
  }
}
export default App;