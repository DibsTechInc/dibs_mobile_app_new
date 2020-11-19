import React, {Component} from 'react';
import { Text, View, Button } from "react-native";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Config from '../../../config.json'
import { getStudioName } from '../../selectors/StudioSelectors';

import {
  LANDING_ROUTE,
} from '../../constants/RouteConstants';


class EnterEmail extends Component {
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
            <Text>This shall be the page to enter email</Text>
            <Button 
              title="Go back to Landing Page"
              onPress={() => this.props.navigation.navigate(LANDING_ROUTE)}
              />
          </View>
      );

    }
}

EnterEmail.propTypes = {
  navigation: PropTypes.shape(),
  studioName: PropTypes.string,
};

EnterEmail.navigationOptions = {
  headerMode: 'none',
};

const mapStateToProps = state => ({
  studioName: getStudioName(state),
})

export default connect(mapStateToProps)(EnterEmail);