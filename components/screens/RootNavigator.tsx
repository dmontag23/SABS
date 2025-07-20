import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import LoggedInScreen from "./LoggedInScreen";
import EnterTokensScreen from "./authentication/EnterTokensScreen";

import LogoOnBackground from "../LogoOnBackground";

import useGetAuthTokens from "../../hooks/asyncStorageHooks/useGetAuthTokens";
import { RootStackParamList } from "../../types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { data, isPending: isLoadingTokens } = useGetAuthTokens();
  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;

  if (isLoadingTokens) return <LogoOnBackground />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {accessToken && refreshToken ? (
        <Stack.Screen name="LoggedIn" component={LoggedInScreen} />
      ) : (
        <Stack.Screen name="EnterTokens" component={EnterTokensScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
