import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { List, Surface, Text } from "react-native-paper";

import LocationHeader from "../Location/LocationHeader";
import LocationsContainer from "../Location/LocationsContainer";
import BottomSheet from "../ui/BottomSheet";
import LoadingSpinner from "../ui/LoadingSpinner";

import useGetLocationId from "../../hooks/asyncStorageHooks/useGetLocationId";
import useGetLocations from "../../hooks/todayTixHooks/useGetLocations";
import { TodayTixLocation } from "../../types/locations";

const createRightElement = (currentLocation?: TodayTixLocation) => (
  <View style={styles.rightElement}>
    {currentLocation ? (
      <Text variant="bodyMedium">{currentLocation.name}</Text>
    ) : (
      <LoadingSpinner />
    )}
    <List.Icon icon="chevron-right" />
  </View>
);

const SettingsScreen = () => {
  const { data: locations } = useGetLocations();
  const { data: currentLocationId } = useGetLocationId();

  const [isLocationBottomSheetOpen, setIsLocationBottomSheetOpen] =
    useState(false);

  const handleLocationPress = () => setIsLocationBottomSheetOpen(true);
  const handleClose = () => setIsLocationBottomSheetOpen(false);

  const currentLocation = (locations ?? []).find(
    ({ id }) => id === currentLocationId
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text variant="displaySmall" style={styles.titleText}>
          Settings
        </Text>
        <Surface mode="flat" style={styles.itemSurface}>
          <List.Item
            title="Location"
            onPress={handleLocationPress}
            right={() => createRightElement(currentLocation)}
            style={[styles.itemSurface, styles.listItem]}
          />
        </Surface>
      </SafeAreaView>
      <BottomSheet
        isOpen={isLocationBottomSheetOpen}
        isFullScreen
        content={
          <>
            <LocationHeader onCloseButtonPress={handleClose} />
            <LocationsContainer onItemPress={handleClose} />
          </>
        }
        testID="location-bottom-sheet"
      />
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { marginHorizontal: 10 },
  itemSurface: { borderRadius: 10 },
  listItem: { overflow: "hidden" },
  rightElement: { flexDirection: "row", alignItems: "center", gap: 5 },
  titleText: { marginVertical: 20, textAlign: "center" }
});
