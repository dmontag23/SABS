import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import config from '../config.json';

const LOGO_URL = `${config.todayTixBaseUrl}/static/ttx_logo_horizontal_white.png`;

const TodayTixLogoOnBackground = () => (
  <View style={{backgroundColor: useTheme().colors.primary}}>
    <SafeAreaView style={styles.logoContainer}>
      <Image style={styles.logo} source={{uri: LOGO_URL}} />
    </SafeAreaView>
  </View>
);

export default TodayTixLogoOnBackground;

const styles = StyleSheet.create({
  logoContainer: {marginHorizontal: '10%'},
  logo: {width: '100%', height: '100%', resizeMode: 'contain'}
});