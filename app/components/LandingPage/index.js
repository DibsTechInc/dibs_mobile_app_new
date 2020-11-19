import React, {Component} from 'react';
import { Text, View, Button } from "react-native";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Config from '../../../config.json'
import { getStudioName } from '../../selectors/StudioSelectors';


class LandingPage extends Component {
  /**
     * @constructor
     * @cosntructs LandingPage
     * @param {Object} props for component 
     */
    constructor(props) {
      super(props);
    }
    render() {
      console.log(`this.props.studioName => ${this.props.studioName}`);
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Config.STUDIO_COLOR}}>
            <Text>Landing Page</Text>
            <Button 
              title="Go to Details"
              onPress={() => navigation.navigate('Details')}
              />
          </View>
      );

    }
}

// function LandingPage({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Config.STUDIO_COLOR}}>
//       <Text>Home Screen</Text>
//       <Button 
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//         />
//     </View>
//   );
// }
LandingPage.propTypes = {
  navigation: PropTypes.shape(),
  studioName: PropTypes.string,
};

LandingPage.navigationOptions = {
  headerMode: 'none',
};

const mapStateToProps = state => ({
  studioName: getStudioName(state),
})

export default connect(mapStateToProps)(LandingPage);