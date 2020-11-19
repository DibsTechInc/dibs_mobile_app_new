import React, {Component} from 'react';
import { Text, View, Button } from "react-native";

import Config from '../../../config.json'

function LandingPage({ navigation }) {
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

export default LandingPage;