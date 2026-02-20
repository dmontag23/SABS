import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RushShowTicketSelection from "./RushShowTicketSelection";

import LoadingSpinner from "../ui/LoadingSpinner";

import TodayTixBanner from "../../assets/TodayTixBanner.jpg";
import { RushShowsStackScreenProps } from "../../types/navigation";

const ShowDetailsScreen = ({
  route,
  navigation
}: RushShowsStackScreenProps<"ShowDetails">) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { top, bottom } = useSafeAreaInsets();
  const { show, showtimes } = route.params;

  const headerImage = show.images?.productMedia.headerImage;

  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel="Header image"
        source={{
          uri: `${__DEV__ ? "http" : "https"}:${headerImage?.file.url ?? show.images?.productMedia.appHeroImage.file.url}`
        }}
        defaultSource={TodayTixBanner}
        resizeMode={headerImage ? "cover" : "stretch"}
        onLoadEnd={() => setIsImageLoading(false)}
        style={styles.image}
      />
      {isImageLoading ? (
        <LoadingSpinner size="large" style={styles.loadingSpinner} />
      ) : (
        <>
          <IconButton
            accessibilityLabel="Back button"
            icon="arrow-left"
            mode="contained-tonal"
            size={30}
            onPress={navigation.goBack}
            style={[styles.backButton, { marginTop: top }]}
          />
          <ScrollView
            contentContainerStyle={{ paddingBottom: bottom + 15 }}
            style={styles.showDetailContainer}
          >
            <RushShowTicketSelection show={show} showtimes={showtimes} />
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default ShowDetailsScreen;

const styles = StyleSheet.create({
  backButton: { position: "absolute", marginLeft: 15 },
  container: { flex: 1 },
  image: { height: 300 },
  loadingSpinner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  showDetailContainer: { flex: 1, paddingTop: 30 }
});
