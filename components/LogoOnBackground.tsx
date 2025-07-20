import React from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";

import { useTheme } from "react-native-paper";

import RushLogo from "../ios/rush/Images.xcassets/RushNeon.imageset/RushNeonTransparent.png";

const LogoOnBackground = () => (
  <View style={{ backgroundColor: useTheme().colors.primary }}>
    <SafeAreaView style={styles.logoContainer}>
      <Image
        accessibilityLabel="TodayTix logo"
        style={styles.logo}
        source={RushLogo}
      />
    </SafeAreaView>
  </View>
);

export default LogoOnBackground;

const styles = StyleSheet.create({
  logoContainer: { marginHorizontal: "10%" },
  logo: { width: "100%", height: "100%", resizeMode: "contain" }
});
