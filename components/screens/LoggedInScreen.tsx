import React from "react";

import LoggedInBottomTabNavigator from "./LoggedInBottomTabNavigator";

import {HoldContextProvider} from "../../store/hold-context";
import {SelectedShowtimeContextProvider} from "../../store/selected-showtime-context";

const LoggedInScreen = () => (
  <SelectedShowtimeContextProvider>
    <HoldContextProvider>
      <LoggedInBottomTabNavigator />
    </HoldContextProvider>
  </SelectedShowtimeContextProvider>
);

export default LoggedInScreen;
