import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Config from './config.json';

// make first screen the splash image
// determine which screen to show next (login or homepage based on usertoken)
// set up homepage
// set up authorization -> take the homepage when successful
// set the left side menu
// set myAccount
// set book
// set myCalendar

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Config.STUDIO_COLOR}}>
      <Text>Home Screen</Text>
      <Button 
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
        />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createStackNavigator();


class App extends React.Component {
  /**
   * @constructor
   * @cosntructs App
   */
  constructor() {
    super();
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: Config.STUDIO_COLOR } 
            }}>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Details" component={DetailsScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;