import React, {useEffect} from "react";

import LoggedInBottomTabNavigator from "./LoggedInBottomTabNavigator";

import useStoreLocationId from "../../hooks/asyncStorageHooks/useStoreLocationId";
import useGetCustomersMe from "../../hooks/todayTixHooks/useGetCustomersMe";
import {HoldContextProvider} from "../../store/hold-context";
import {SelectedShowtimeContextProvider} from "../../store/selected-showtime-context";

const LoggedInScreen = () => {
  const {data: currentCustomer} = useGetCustomersMe();
  const {mutate: storeLocationId} = useStoreLocationId();

  // Store the home location as the initial location used for the app on login
  useEffect(
    () => currentCustomer && storeLocationId(currentCustomer.homeLocationId),
    [currentCustomer, storeLocationId]
  );

  return (
    <SelectedShowtimeContextProvider>
      <HoldContextProvider>
        <LoggedInBottomTabNavigator />
      </HoldContextProvider>
    </SelectedShowtimeContextProvider>
  );
};

export default LoggedInScreen;
