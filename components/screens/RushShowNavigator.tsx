import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import RushShowListScreen from "./RushShowListScreen";

import ShowDetailsScreen from "../ShowDetails/ShowDetailsScreen";

import { RushShowStackParamList } from "../../types/navigation";

const Stack = createStackNavigator<RushShowStackParamList>();

const RushShowNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RushShowList" component={RushShowListScreen} />
    <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
  </Stack.Navigator>
);

export default RushShowNavigator;
