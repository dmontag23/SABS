import React from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import {useTheme} from "react-native-paper";

import LocationItem from "./LocationItem";

import LoadingSpinner from "../ui/LoadingSpinner";

import useGetLocationId from "../../hooks/asyncStorageHooks/useGetLocationId";
import useGetLocations from "../../hooks/todayTixHooks/useGetLocations";

type LocationsContainerProps = {
  onItemPress?: () => void;
};

const LocationsContainer = ({onItemPress}: LocationsContainerProps) => {
  const {colors} = useTheme();

  const {
    data: locations,
    isPending: isLocationsLoading,
    isSuccess: isLocationsSuccess
  } = useGetLocations();
  const {data: currentLocationId, isPending: isCurrentLocationIdLoading} =
    useGetLocationId();

  return isLocationsLoading || isCurrentLocationIdLoading ? (
    <View style={styles.loadingSpinnerContainer}>
      <LoadingSpinner size="large" />
    </View>
  ) : (
    <ScrollView
      contentContainerStyle={[
        styles.locationsContainer,
        {backgroundColor: colors.surfaceVariant}
      ]}>
      {isLocationsSuccess &&
        locations
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map(location => (
            <LocationItem
              key={location.id}
              location={location}
              isChecked={currentLocationId === location.id}
              onPress={onItemPress}
            />
          ))}
    </ScrollView>
  );
};

export default LocationsContainer;

const styles = StyleSheet.create({
  loadingSpinnerContainer: {marginTop: 50},
  locationsContainer: {
    gap: 10,
    marginHorizontal: "10%",
    marginTop: 15,
    borderRadius: 10
  }
});
