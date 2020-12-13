import { 
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
    createDrawerNavigator,
 } from '@react-navigation/drawer';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import styled from 'styled-components';

import Config from '../../../../config.json';
import {
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SCHEDULE_ROUTE,
  ACTUAL_WHITE,
  DARK_TEXT_GREY,
  UPCOMING_CLASS_ROUTE,
  BUY_ROUTE,
  REFER_A_FRIEND_ROUTE,
  MY_CLASSES_ROUTE,
} from '../../../constants';
import MainPage from '../../MainPage';

import {
  getUsersFullName,
  getFormattedTotalCreditsWithFlashCredits,
  getUsersFirstPassName,
  getUserHasFlashCredit,
  getStudioShowsCredits,
  getUsersFirstPassIsUnlimited,
  getUsersFirstPassUsesLeft,
  getUsersFirstPassShortExpiresAt,
} from '../../../selectors';
import {
  CartIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  ActivityIcon,
  HomeIcon,
  PackageIcon,
  RafIcon,
  MyClassesIcon,
} from '../../shared';
import { SpaceBetweenRow, HeavyText } from '../../styled';
import BalanceDisplay from './BalanceDisplay';
// import NavLink from './NavLink';

const StyledContainer = styled.View`
  background: ${ACTUAL_WHITE};
  paddingHorizontal: 20;
  paddingTop: 20;
  height: 100%;
`;

const StyledHeader = styled(SpaceBetweenRow)`
  align-items: center;
`;

const StyledCloseButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20;
`;

const StyledHeavyText = styled(HeavyText)`
  color: ${DARK_TEXT_GREY};
  font-size: 16;
  max-width: 180px;
  margin-bottom: 20;
`;


const StyledSpaceHere = styled.View`
  margin-bottom: 18;
`;


class TopDrawerContent extends React.Component {
    render() {
      return (
        <DrawerContentScrollView {...this.props}>
        <StyledContainer>
          <StyledHeader>
            <StyledHeavyText numberOfLines={1}>
              {this.props.usersFullName}
            </StyledHeavyText>
          </StyledHeader>
          <StyledSpaceHere>
          <BalanceDisplay
            label="Credit Balance"
            value={this.props.creditBalance}
            hasFlashCredit={this.props.hasFlashCredit}
          />
          {Boolean(this.props.firstPassName) ? (
          <BalanceDisplay
            label="Current Package"
            value={[
              (this.props.firstPassIsUnlimited ?
                '' : `${this.props.firstPassUsesLeft} Left - `)
              + this.props.firstPassName,
              `(Exp. ${this.props.firstPassExp})`,
            ]}
          />
        ) : undefined}
        </StyledSpaceHere>
          <DrawerItemList {...this.props}/>
        </StyledContainer>
      </DrawerContentScrollView>
      );
    }
  }

  TopDrawerContent.propTypes = {
    usersFullName: PropTypes.string,
    creditBalance: PropTypes.string,
    hasFlashCredit: PropTypes.bool,
    firstPassName: PropTypes.string,
    firstPassIsUnlimited: PropTypes.bool,
    firstPassUsesLeft: PropTypes.number,
    firstPassExp: PropTypes.string,
    navigation: PropTypes.shape(),
    showsCreditTiers: PropTypes.bool,
  }

  const mapStatetoProps = state => ({
    usersFullName: getUsersFullName(state),
    creditBalance: getFormattedTotalCreditsWithFlashCredits(state),
    hasFlashCredit: getUserHasFlashCredit(state),
    firstPassName: getUsersFirstPassName(state),
    firstPassIsUnlimited: getUsersFirstPassIsUnlimited(state),
    firstPassUsesLeft: getUsersFirstPassUsesLeft(state),
    firstPassExp: getUsersFirstPassShortExpiresAt(state),
    hasFlashCredit: getUserHasFlashCredit(state),
    showsCreditTiers: getStudioShowsCredits(state),
  });


// const TopDrawerContent = ({ ...props}) => (
//     <DrawerContentScrollView {...props}>
//         <StyledContainer>
//           <StyledHeader>
//             <StyledHeavyText numberOfLines={1}>
//               Alicia Thomas
//             </StyledHeavyText>
//           </StyledHeader>
//           <BalanceDisplay
//           label="Credit Balance"
//           value="56"
//           hasFlashCredit={true}
//         />
//           <DrawerItemList {...props}/>
//         </StyledContainer>
//       </DrawerContentScrollView>
// );

// export default TopDrawerContent;
export default connect(mapStatetoProps)(TopDrawerContent);
