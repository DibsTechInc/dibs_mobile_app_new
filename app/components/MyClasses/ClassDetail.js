import React from 'react';
import PropTypes from 'prop-types';

import UpcomingEvent from '../shared/PaginatedSlider/UpcomingEvent';

/**
 * @class ClassDetail
 * @extends {React.PureComponent}
 */
class ClassDetail extends React.PureComponent {
  /**
   * render
   * @returns {JSX.Element} HTML
   */
  render() {
    console.log(`classDetail ===> ${JSON.stringify(this.props.route)}`);
    const { params } = this.props.route;
    return (
      <UpcomingEvent
        hasHeader
        {...params}
      />
    );
  }
}

ClassDetail.propTypes = {
  navigation: PropTypes.shape(),
};

export default ClassDetail;
