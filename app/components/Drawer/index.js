import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SCHEDULE_ROUTE,
  CART_ROUTE,
  RECEIPT_ROUTE,
  UPCOMING_CLASS_ROUTE,
  BUY_ROUTE,
  REFER_A_FRIEND_ROUTE,
  MY_CLASSES_ROUTE,
  WIDTH,
} from '../../constants';

import {
  getDrawerConfig,
} from '../../util/navigation';

import MainPage from '../MainPage';
import { ProfilePage } from '../ProfilePage';
import SchedulePage from '../SchedulePage';
import CartPage from '../CartPage';
import SideMenu from './SideMenu';
import ReceiptPage from '../ReceiptPage';
import UpcomingClassesPage from '../UpcomingClassesPage';
import BuyItemsPage from '../BuyItemsPage';
import ReferAFriendPage from '../ReferAFriendPage';
import MyClasses from '../MyClasses';

const Drawer = createDrawerNavigator();


// const MainNavigatorDrawer = () => {
//   return (
//     <NavigationContainer>
//     <mainNavigator.Navigator>
//       <mainNavigator.Screen name="MealsFav" component={MealsFavTabNavigator} />
//       <mainNavigator.Screen name="Filters" component={FiltersNavigator} />
//     </mainNavigator.Navigator>
//     </NavigationContainer>
//   );
// };

export default function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerPosition='left'
      initialRouteName={MAIN_ROUTE}
      component={SideMenu}
      drawerStyle={{ width: 300 }}
      >
      <Drawer.Screen name={MAIN_ROUTE} component={MainPage} />
      <Drawer.Screen name={PROFILE_ROUTE} component={ProfilePage} />
      <Drawer.Screen name={SCHEDULE_ROUTE} component={SchedulePage} />
      <Drawer.Screen name={UPCOMING_CLASS_ROUTE} component={UpcomingClassesPage} />
      <Drawer.Screen name={CART_ROUTE} component={CartPage} />
      <Drawer.Screen name={RECEIPT_ROUTE} component={ReceiptPage} />
      <Drawer.Screen name={BUY_ROUTE} component={BuyItemsPage} />
      <Drawer.Screen name={REFER_A_FRIEND_ROUTE} component={ReferAFriendPage} />
      <Drawer.Screen name={MY_CLASSES_ROUTE} component={MyClasses} />
    </Drawer.Navigator>
  );
}


// export default createDrawerNavigator({
//   <Drawer.Navigator
//     drawerPosition='left'
//     initialRouteName='MAIN_ROUTE'
//     drawerStyle={{ width: 300 }}
//     >
//       <Drawer.Screen name='MAIN_ROUTE' component={MainPage} />
//       <Drawer.Screen name='PROFILE_ROUTE' component={ProfilePage} />
//       <Drawer.Screen name='SCHEDULE_ROUTE' component={SchedulePage} />
//       <Drawer.Screen name='UpcomingClasses' component={UpcomingClassesPage} />
//       <Drawer.Screen name='CART_ROUTE' component={CartPage} />
//       <Drawer.Screen name='RECEIPT_ROUTE' component={ReceiptPage} />
//       <Drawer.Screen name='BUY_ROUTE' component={BuyItemsPage} />
//       <Drawer.Screen name='REFER_A_FRIEND_ROUTE' component={ReferAFriendPage} />
//       <Drawer.Screen name='MY_CLASSES_ROUTE' component={MyClasses} />
//     </Drawer.Navigator>
// });

// export function MyDrawer() {
//   return(
//     <Drawer.Navigator
//     drawerPosition='left'
//     initialRouteName={MAIN_ROUTE}
//     component={SideMenu}
//     drawerStyle={{ width: 300 }}
//     >
//       <Drawer.Screen name={MAIN_ROUTE} component={MainPage} />
//       <Drawer.Screen name={PROFILE_ROUTE} component={ProfilePage} />
//       <Drawer.Screen name={SCHEDULE_ROUTE} component={SchedulePage} />
//       <Drawer.Screen name={UPCOMING_CLASS_ROUTE} component={UpcomingClassesPage} />
//       <Drawer.Screen name={CART_ROUTE} component={CartPage} />
//       <Drawer.Screen name={RECEIPT_ROUTE} component={ReceiptPage} />
//       <Drawer.Screen name={BUY_ROUTE} component={BuyItemsPage} />
//       <Drawer.Screen name={REFER_A_FRIEND_ROUTE} component={ReferAFriendPage} />
//       <Drawer.Screen name={MY_CLASSES_ROUTE} component={MyClasses} />
//     </Drawer.Navigator>
//   );

// }

// export default createDrawerNavigator({
//   [MAIN_ROUTE]: { screen: MainPage },
//   [PROFILE_ROUTE]: { screen: ProfilePage },
//   [SCHEDULE_ROUTE]: { screen: SchedulePage },
//   [UPCOMING_CLASS_ROUTE]: { screen: UpcomingClassesPage },
//   [CART_ROUTE]: { screen: CartPage },
//   [RECEIPT_ROUTE]: { screen: ReceiptPage },
//   [BUY_ROUTE]: { screen: BuyItemsPage },
//   [REFER_A_FRIEND_ROUTE]: { screen: ReferAFriendPage },
//   [MY_CLASSES_ROUTE]: { screen: MyClasses },
// }, getDrawerConfig(300, 'left', MAIN_ROUTE, SideMenu));
