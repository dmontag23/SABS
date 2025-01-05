import React from "react";
import {StyleSheet, View} from "react-native";

import {Button, Text} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import useStoreLocationId from "../../hooks/asyncStorageHooks/useStoreLocationId";
import {TodayTixLocation} from "../../types/locations";

type LocationItemProps = {
  location: TodayTixLocation;
  isChecked: boolean;
  onPress?: () => void;
};

const LocationItem = ({location, isChecked, onPress}: LocationItemProps) => {
  const {mutate: storeLocationId} = useStoreLocationId();

  return (
    <Button
      onPress={() => {
        storeLocationId(location.id);
        onPress?.();
      }}
      labelStyle={styles.buttonLabel}>
      <View style={styles.labelContainer}>
        <Text>{location.name}</Text>
        {isChecked && <MaterialCommunityIcons name="check" size={24} />}
      </View>
    </Button>
  );
};

export default LocationItem;

const styles = StyleSheet.create({
  buttonLabel: {flex: 1},
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
});
