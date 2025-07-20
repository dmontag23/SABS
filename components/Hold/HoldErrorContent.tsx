import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Text } from "react-native-paper";

import useGetCustomerId from "../../hooks/useGetCustomerId";
import HoldContext from "../../store/hold-context";
import SelectedShowtimeContext from "../../store/selected-showtime-context";

type HoldErrorContentProps = { message: string };

const HoldErrorContent = ({ message }: HoldErrorContentProps) => {
  const { customerId } = useGetCustomerId();

  const {
    selectedShowtime: showtime,
    selectedNumberOfTickets: numberOfTickets
  } = useContext(SelectedShowtimeContext);

  const { scheduleHold, cancelHold } = useContext(HoldContext);

  const retryPlacingHold = () => {
    cancelHold();
    if (customerId && showtime && numberOfTickets)
      scheduleHold(0, {
        customerId,
        showtimeId: showtime.id,
        numTickets: numberOfTickets
      });
  };

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button mode="outlined" onPress={retryPlacingHold}>
        Retry
      </Button>
    </View>
  );
};

export default HoldErrorContent;

const styles = StyleSheet.create({ container: { rowGap: 15 } });
