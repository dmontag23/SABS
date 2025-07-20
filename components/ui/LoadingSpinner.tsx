import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ActivityIndicator } from "react-native-paper";

type LoadingSpinnerProps = {
  size?: number | "small" | "large";
  style?: StyleProp<ViewStyle>;
};

const LoadingSpinner = ({ size, style }: LoadingSpinnerProps) => (
  <ActivityIndicator size={size} style={style} testID="loading-spinner" />
);

export default LoadingSpinner;
