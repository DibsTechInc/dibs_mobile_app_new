import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Animated, View } from 'react-native';

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
  bottom: 0px;
  height: 3px;
  position: absolute;
  right: 0px;
  width: ${props => props.width};
`;

const QuoteView = styled.View`
  width: 60%;
  margin-bottom: 50px;
  padding-horizontal: 15px;
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
  /**
   * @returns {undefined}
   */
  componentDidMount() {
    console.log('starting to cycle animation');
    this.cycleAnimation();
  }
  /**
   * @returns {undefined}
   */
  cycleAnimation() {
    Animated.sequence([
      Animated.timing(
        this.state.barWidthProgress,
        { toValue: 1, 
          duration: 750,
          useNativeDriver: false,
        }
      ),
      Animated.timing(
        this.state.barLeftProgress,
        { toValue: 1, 
          duration: 750,
          useNativeDriver: false, 
        }
      ),
      Animated.parallel([
        Animated.timing(
          this.state.barWidthProgress,
          { toValue: 0, duration: 0, useNativeDriver: false }
        ),
        Animated.timing(
          this.state.barLeftProgress,
          { toValue: 0, duration: 0, useNativeDriver: false }
        ),
      ]),
    ]).start(() => this.cycleAnimation());
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    // check if studio has custom html quote styling
    console.log(`this.state.quote ==> ${this.state.quote}`);
    console.log(`color props: ${this.props.color}`);
    // console.log(`barLeftProgress: ${JSON.stringify(this.state.barLeftProgress)}`);
    const renderTypeOfQuote = <NormalQuoteText color={this.props.color}>{this.state.quote}</NormalQuoteText>;
    
    return (
      <LoaderContainer>
      {this.props.showQuote &&
        <QuoteView>
          {renderTypeOfQuote}
        </QuoteView>
      }
      <View style={{width: 200, position: 'relative', overflow: 'hidden', height: 5}}>
        <LoaderBackground
          color={this.props.color}
          width='200px'
        />
        <Animated.View
          style={{
            backgroundColor: this.props.color,
            bottom: 0,
            height: 3,
            left: Animated.multiply(200, this.state.barLeftProgress),
            position: 'absolute',
            width: Animated.multiply(200, this.state.barWidthProgress),
          }}
        />
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
