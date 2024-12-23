import React from "react";
import {ScrollView, StyleSheet} from "react-native";

import {useTheme} from "react-native-paper";

import LocationItem from "./LocationItem";

import useGetLocation from "../../hooks/asyncStorageHooks/useGetLocation";
import {TodayTixLocation} from "../../types/shows";

type LocationsContainerProps = {
  onItemPress?: () => void;
};

const LocationsContainer = ({onItemPress}: LocationsContainerProps) => {
  const {colors} = useTheme();

  const {data: currentLocation} = useGetLocation();

  const locations = Object.keys(TodayTixLocation).filter(key =>
    isNaN(Number(key))
  ) as Array<keyof typeof TodayTixLocation>;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.locationsContainer,
        {backgroundColor: colors.surfaceVariant}
      ]}>
      {locations.map((location, i) => (
        <LocationItem
          key={i}
          location={location}
          isChecked={currentLocation === TodayTixLocation[location]}
          onPress={onItemPress}
        />
      ))}
    </ScrollView>
  );
};

export default LocationsContainer;

const styles = StyleSheet.create({
  locationsContainer: {
    gap: 10,
    marginHorizontal: "10%",
    marginTop: 15,
    borderRadius: 10
  }
});
