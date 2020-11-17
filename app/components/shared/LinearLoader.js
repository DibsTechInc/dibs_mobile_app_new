import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Animated, View, Text } from 'react-native';
import HTML from 'react-native-render-html';

import { WHITE } from '../../constants';
import { fadeColor, generateQuote } from '../../helpers';
import { NormalText } from '../../components/styled';

const LoaderContainer = styled.View`
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const LoaderBackground = styled.View`
  background-color: ${props => fadeColor(props.color, 0.75)};
  bottom: 0;
  height: 3;
  position: absolute;
  right: 0;
  width: ${props => props.width};
`;

const QuoteView = styled.View`
  width: 60%;
  margin-bottom: 50px;
  padding-horizontal: 15;
  align-items: center;
`;

const NormalQuoteText = styled(NormalText)`
  color: ${props => props.color};
  text-align: center;
`;

/**
 * @class LinearLoader
 * @extends {React.PureComponent}
 */
class LinearLoader extends React.PureComponent {
  /**
   * @constructor
   * @constructs LinearLoader
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.state = {
      barWidthProgress: new Animated.Value(0),
      barLeftProgress: new Animated.Value(0),
      quote: generateQuote(),
    };
  }
  // /**
  //  * @returns {undefined}
  //  */
  // componentDidMount() {
  //   this.cycleAnimation();
  // }
  // /**
  //  * @returns {undefined}
  //  */
  // cycleAnimation() {
  //   Animated.sequence([
  //     Animated.timing(
  //       this.state.barWidthProgress,
  //       { toValue: 1, 
  //         duration: 750,
  //         useNativeDriver: false,
  //       }
  //     ),
  //     Animated.timing(
  //       this.state.barLeftProgress,
  //       { toValue: 1, 
  //         duration: 750,
  //         useNativeDriver: false, 
  //       }
  //     ),
  //     Animated.parallel([
  //       Animated.timing(
  //         this.state.barWidthProgress,
  //         { toValue: 0, duration: 0, useNativeDriver: false }
  //       ),
  //       Animated.timing(
  //         this.state.barLeftProgress,
  //         { toValue: 0, duration: 0, useNativeDriver: false }
  //       ),
  //     ]),
  //   ]).start(() => this.cycleAnimation());
  // }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    // check if studio has custom html quote styling
    console.log(`this.state.quote ==> ${this.state.quote}`);
    
    return (
      <LoaderContainer>
        <View style={{ width: 200, position: 'relative', overflow: 'hidden', height: 5 }}>
          {/* <Animated.View
            style={{
              backgroundColor: this.props.color,
              bottom: 0,
              height: 3,
              // left: Animated.multiply(this.props.width, this.state.barLeftProgress),
              position: 'absolute',
              useNativeDriver: false,
              width: Animated.multiply(this.props.width, this.state.barWidthProgress),
            }}
          /> */}
          <Text>Alicia</Text>
        </View>
      </LoaderContainer>
    );
  }
}

LinearLoader.defaultProps = {
  color: WHITE,
  showQuote: false,
};

LinearLoader.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  showQuote: PropTypes.bool,
};

export default LinearLoader;
