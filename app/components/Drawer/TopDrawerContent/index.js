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
  WHITE,
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
// import BalanceDisplay from './BalanceDisplay';
// import NavLink from './NavLink';

const StyledContainer = styled.View`
  background: ${WHITE};
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
`;



const TopDrawerContent = ({ ...props}) => (
    <DrawerContentScrollView {...props}>
        <StyledContainer>
          <StyledHeader>
            <StyledHeavyText numberOfLines={1}>
              Alicia Thomas
            </StyledHeavyText>
          </StyledHeader>
        </StyledContainer>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
);

export default TopDrawerContent;