import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withNavigation } from '@react-navigation/compat';

import { WHITE, TEXT_GREY, SCHEDULE_ROUTE } from '../../constants';
import Header from '../Header';
import { FadeInView, MaterialButton } from '../shared';
import { NormalText } from '../styled';

const BackButtonContainer = styled.View`
  align-items: center;
  background: ${WHITE};
  padding-vertical: 30;
  width: 100%;
`;

const BodyText = styled(NormalText)`
  color: ${TEXT_GREY};
  margin-bottom: 20;
`;

/**
 * @class NoItems
 * @extends {React.PureComponent}
 */
class NoItems extends React.PureComponent {
  /**
   * @constructor
   * @constructs NoItems
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);
    this.goToSchedule = this.goToSchedule.bind(this);
  }
  /**
   * @returns {undefined}
   */
  goToSchedule() {
    this.props.navigation.navigate(SCHEDULE_ROUTE);
  }
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    return (
      <FadeInView>
        <Header title="My Cart" />
        <BackButtonContainer>
          <BodyText>
            Your cart is empty.
          </BodyText>
          <MaterialButton
            text="Book Now"
            onPress={this.goToSchedule}
            style={{ width: 200, height: 40 }}
          />
        </BackButtonContainer>
      </FadeInView>
    );
  }
}

NoItems.propTypes = {
  navigation: PropTypes.shape(),
};

export default withNavigation(NoItems);
