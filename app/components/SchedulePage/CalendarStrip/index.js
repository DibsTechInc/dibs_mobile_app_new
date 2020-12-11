import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Animated,
  Easing,
} from 'react-native';
import moment from 'moment-timezone';
import styled from 'styled-components';

import { setScheduleCurrentDate, addDaysToScheduleCurrentDate } from '../../../actions';
import CalendarDay from './CalendarDay';
import { WHITE, WIDTH } from '../../../constants';
import Config from '../../../../config.json';
import { FlexRow, FlexCenter, HeavyText } from '../../styled';
import { FadeInView } from '../../shared';
import CalendarArrow from './CalendarArrow';

const CalendarHeader = styled(HeavyText)`
  color: ${WHITE};
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8;
  margin-top: 4;
`;

const DatesContainer = styled(FlexCenter)`
  flex-direction: row;
  flex: 1;
`;

/**
 * @class CalendarStrip
 * @extends Component
 */
class CalendarStrip extends PureComponent {
  /**
   * @static
   * @returns {number} number of days for the calendar to display
   */
  static getNumberOfDaysToDisplay() {
    return WIDTH > 350 ? 7 : 5;
  }
  /**
   * @constructor
   * @constructs CalendarStrip
   * @param {Object} props for component
   */
  constructor(props) {
    super(props);

    const startingDate = moment();
    const numberOfDays = CalendarStrip.getNumberOfDaysToDisplay();
    startingDate.add(Math.floor(props.currentDate.diff(startingDate, 'days') / numberOfDays) * numberOfDays, 'days');

    this.state = {
      numberOfDays,
      startingDate,
    };

    this.resetAnimation();

    this.componentDidMount = this.componentDidMount.bind(this);
    // this.componentWillUpdate = this.componentWillUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.getDatesForWeek = this.getDatesForWeek.bind(this);
    this.getPreviousDays = this.getPreviousDays.bind(this);
    this.getNextDays = this.getNextDays.bind(this);
    this.isDateSelected = this.isDateSelected.bind(this);
    this.formatCalendarHeader = this.formatCalendarHeader.bind(this);
    this.animate = this.animate.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this);
  }
  /**
   * starts animation
   * @returns {undefined}
   */
  componentDidMount() {
    this.animate();
  }
  /**
   * @param {Object} props component will receive
   * @returns {undefined}
   */
  componentDidUpdate(props) {
  // componentWillUpdate(props) {
    if (props.currentDate.toISOString() === this.props.currentDate.toISOString()) {
      this.resetAnimation();
      this.animate();
    }
  }
  /**
   * @param {Object} d date selected before being turned into a moment instance
   * @returns {undefined}
   */
  onDateSelected(d) {
    const date = moment(d);
    const invalidSelection = date.isBefore(this.state.startingDate);
    if (invalidSelection) return;
    this.props.setScheduleCurrentDate(moment(date, Config.STUDIO_TZ));
  }
  /**
   * Set startingDate to the previous set of days
   * @returns {undefined}
   */
  async getPreviousDays() {
    await new Promise(res =>
      this.setState({ startingDate: this.state.startingDate.subtract(this.state.numberOfDays, 'd') }, res));
    this.props.addDaysToScheduleCurrentDate(-this.state.numberOfDays);
  }
  /**
   * Set startingDate to the next set of days
   * @returns {undefined}
   */
  async getNextDays() {
    await new Promise(res =>
      this.setState({ startingDate: this.state.startingDate.add(this.state.numberOfDays, 'd') }, res));
    this.props.addDaysToScheduleCurrentDate(this.state.numberOfDays);
  }
  /**
   * Get dates for the week based on the startingDate
   * Using isoWeekday so that it will start from Monday
   * @returns {undefined}
   */
  getDatesForWeek() {
    const startDate = moment(this.state.startingDate).tz(Config.STUDIO_TZ);
    const dateInfos = [];
    [...Array(this.state.numberOfDays)].forEach((item, index) => {
      const dateInfo = {
        date: null,
        isExpiredDate: null,
      };
      dateInfo.date = moment(startDate).tz(Config.STUDIO_TZ).add(index, 'days');
      dateInfo.isExpiredDate = dateInfo.date.isBefore(this.props.lowerBound);
      dateInfos.push(dateInfo);
    });
    return dateInfos;
  }
  /**
   * Function to check if provided date is the same as selected one, hence date is selected
   * using isSame moment query with 'day' param so that it check years, months and day
   * @param {Object} date you are comparing to the selected date
   * @returns {boolean} if they are the same date
   */
  isDateSelected(date) {
    return date.isSame(this.props.currentDate, 'day');
  }
  /**
   * Function for reseting animations
   * @returns {undefined}
   */
  resetAnimation() {
    this.animatedValue = [];
    [...Array(this.state.numberOfDays)].forEach((value) => {
      this.animatedValue[value] = new Animated.Value(0);
    });
  }
  /**
   * Function to animate showing the CalendarDay elements.
   * Possible cases for animations are sequence and parallel
   * @returns {undefined}
   */
  animate() {
    if (this.props.calendarAnimation) {
      const animations = [...Array(this.state.numberOfDays)].map(item =>
        Animated.timing(
          this.animatedValue[item],
          {
            toValue: 1,
            duration: this.props.calendarAnimation.duration,
            easing: Easing.linear,
            useNativeDriver: false,
          }
        )
      );
      if (this.props.calendarAnimation.type.toLowerCase() === 'sequence') {
        Animated.sequence(animations).start();
      } else if (this.props.calendarAnimation.type.toLowerCase() === 'parallel') {
        Animated.parallel(animations).start();
      } else {
        throw new Error('CalendarStrip Error! Type of animation is incorrect!');
      }
    }
  }

  /**
   * Function that formats the calendar header
   * It also formats the month section if the week is in between months
   * @returns {string} formatted calendar header
   */
  formatCalendarHeader() {
    const firstDay = this.getDatesForWeek()[0].date;
    const lastDay = this.getDatesForWeek()[this.getDatesForWeek().length - 1].date;
    let monthFormatting = '';
    // Parsing the month part of the user defined formating
    if ((this.props.calendarHeaderFormat.match(/Mo/g) || []).length > 0) {
      monthFormatting = 'Mo';
    } else if ((this.props.calendarHeaderFormat.match(/M/g) || []).length > 0) {
      for (let i = (this.props.calendarHeaderFormat.match(/M/g) || []).length; i > 0; i -= 1) {
        monthFormatting += 'M';
      }
    }
    if (firstDay.month() === lastDay.month()) {
      return firstDay.format(this.props.calendarHeaderFormat);
    }
    if (firstDay.year() !== lastDay.year()) {
      return `${firstDay.format(this.props.calendarHeaderFormat)} / ${lastDay.format(this.props.calendarHeaderFormat)}`;
    }
    return `${monthFormatting.length > 1 ? firstDay.format(monthFormatting) : ''} ${monthFormatting.length > 1 ? '/' : ''} ${lastDay.format(this.props.calendarHeaderFormat)}`;
  }

  /**
   * @returns {JSX} XML
   */
  render() {
    const lowerBound = this.state.startingDate.clone().subtract(this.state.numberOfDays, 'd').add(1, 'd');
    const canGoBack = lowerBound.isBefore(this.props.lowerBound);

    let opacityAnim = 1;

    if (this.props.hideStrip) {
      return <FadeInView pointerEvents="box-none" style={{ height: 80, overflow: 'hidden', top: -20, zIndex: 1, flex: 0 }} />;
    }

    return (
      <FadeInView pointerEvents="box-none" style={{ overflow: 'hidden', top: -10, zIndex: 1, flex: 0 }}>
        <CalendarHeader>
          {this.formatCalendarHeader()}
        </CalendarHeader>
        <FlexRow>
          <CalendarArrow
            disabled={canGoBack}
            onPress={this.getPreviousDays}
          />
          <DatesContainer>
            {this.getDatesForWeek().map(({ date }, index) => {
              if (this.props.calendarAnimation) {
                opacityAnim = this.animatedValue[index];
              }
              return (
                <Animated.View key={date} style={{ opacity: opacityAnim, flex: 1 }}>
                  <CalendarDay
                    key={date}
                    date={date}
                    selected={this.isDateSelected(date)}
                    onDateSelected={() => this.onDateSelected(date)}
                    selectionAnimation={this.props.selectionAnimation}
                  />
                </Animated.View>
              );
            })}
          </DatesContainer>
          <CalendarArrow
            onPress={this.getNextDays}
            rightArrow
          />
        </FlexRow>
      </FadeInView>
    );
  }
}

/* eslint-disable global-require */
CalendarStrip.defaultProps = {
  lowerBound: moment().tz(Config.STUDIO_TZ).startOf('day'),
  calendarHeaderFormat: 'MMMM YYYY',
};

CalendarStrip.propTypes = {
  lowerBound: PropTypes.shape(),
  calendarHeaderFormat: PropTypes.string,
  calendarAnimation: PropTypes.shape(),
  selectionAnimation: PropTypes.shape(),
  currentDate: PropTypes.shape(),
  setScheduleCurrentDate: PropTypes.func,
  addDaysToScheduleCurrentDate: PropTypes.func,
  hideStrip: PropTypes.bool,
};

const mapStateToProps = state => ({ currentDate: state.events.currentDate });
const mapDispatchToProps = {
  setScheduleCurrentDate,
  addDaysToScheduleCurrentDate,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarStrip);
