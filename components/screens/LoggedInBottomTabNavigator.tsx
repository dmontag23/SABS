import React, { useState } from "react";
import { View } from "react-native";

import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import RushShowNavigator from "./RushShowNavigator";
import SettingsScreen from "./SettingsScreen";

import HoldConfirmationBottomSheet from "../Hold/HoldConfirmationBottomSheet";

import { LoggedInBottomTabParamList } from "../../types/navigation";

const BottomTab = createBottomTabNavigator<LoggedInBottomTabParamList>();

const BottomTabBarWrapper = (props: BottomTabBarProps) => <TabBar {...props} />;

const TabBar = (props: BottomTabBarProps) => {
  const [bottomNavBarHeight, setBottomNavBarHeight] = useState(0);

  return (
    <>
      <HoldConfirmationBottomSheet bottomInset={bottomNavBarHeight} />
      <View
        onLayout={({ nativeEvent }) =>
          setBottomNavBarHeight(nativeEvent.layout.height)
        }
        testID="bottom-tab-bar-wrapper"
      >
        <BottomTabBar {...props} />
      </View>
    </>
  );
};

/* The bottom tab bar here is based on 
https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/BottomNavigationBar/ */
const BottomTabBar = ({
  navigation,
  state,
  descriptors,
  insets
}: BottomTabBarProps) => (
  <BottomNavigation.Bar
    navigationState={state}
    safeAreaInsets={insets}
    onTabPress={({ route }) => {
      navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true
      });

      navigation.dispatch({
        ...CommonActions.navigate(route.name, route.params),
        target: state.key
      });
    }}
    renderIcon={({ route, focused, color }) => {
      const { options } = descriptors[route.key];
      return options.tabBarIcon?.({ focused, color, size: 24 });
    }}
    getLabelText={({ route }) => {
      const { options } = descriptors[route.key];
      /* Technically the tabBarLabel can also be a function that returns a react element, but because
      we have control over what gets passed into the tabBarLabel option in the tabs below, we can always
      ensure a string is passed in. The typecast is a tradeoff - we can either typecast, or not have full
      test coverage. Typecasting leads to the more elegant solution. */
      return options.tabBarLabel as string;
    }}
  />
);

const CreateTabBarIcon =
  (name: (typeof Icon)["name"]): BottomTabNavigationOptions["tabBarIcon"] =>
  ({ color, size }) => <Icon name={name} size={size} color={color} />;

const LoggedInBottomTabNavigator = () => (
  /* The tab navigator is used instead of the BottomNavigation from react-native-paper because
  the height of the bottom navigation bar is needed to place the hold confirmation bottom sheet
  properly, and it does not seem there is a way to get this height from the BottomNavigation component. */
  <BottomTab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={BottomTabBarWrapper}
  >
    <BottomTab.Screen
      name="RushShows"
      component={RushShowNavigator}
      options={{
        tabBarLabel: "Rush Shows",
        tabBarIcon: CreateTabBarIcon("drama-masks")
      }}
    />
    <BottomTab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: "Settings",
        tabBarIcon: CreateTabBarIcon("cog")
      }}
    />
  </BottomTab.Navigator>
);

export default LoggedInBottomTabNavigator;
