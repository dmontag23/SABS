import React, {RefObject} from "react";
import {useMemo} from "react";
import {StyleSheet, View, useWindowDimensions} from "react-native";

import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {useTheme} from "react-native-paper";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import LocationHeader from "./LocationHeader";
import LocationsContainer from "./LocationsContainer";

type LocationBottomSheetModalProps = {
  innerRef: RefObject<BottomSheetModalMethods>;
};

const LocationBottomSheetModal = ({
  innerRef
}: LocationBottomSheetModalProps) => {
  const {colors} = useTheme();

  const {height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [height - insets.top], [height, insets.top]);

  const handleClose = () => innerRef.current?.close();

  return (
    <BottomSheetModal
      ref={innerRef}
      snapPoints={snapPoints}
      handleComponent={null}
      enableDynamicSizing={false}
      backgroundStyle={{backgroundColor: colors.elevation.level1}}>
      <View style={[styles.container]}>
        <LocationHeader onCloseButtonPress={handleClose} />
        <LocationsContainer onItemPress={handleClose} />
      </View>
    </BottomSheetModal>
  );
};

export default LocationBottomSheetModal;

const styles = StyleSheet.create({container: {flex: 1, marginTop: 10}});
