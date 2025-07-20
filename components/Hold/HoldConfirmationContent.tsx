import React, { useContext, useEffect } from "react";
import { Linking, StyleSheet, View } from "react-native";

import { Button, Card, Text } from "react-native-paper";

import { pluralize } from "../utils";

import useDeleteHold from "../../hooks/todayTixHooks/useDeleteHold";
import SelectedShowtimeContext from "../../store/selected-showtime-context";
import { TodayTixHold } from "../../types/holds";

type HoldConfirmationProps = { hold: TodayTixHold };

const HoldConfirmation = ({ hold }: HoldConfirmationProps) => {
  // TODO: Add an error here on the page if deleting the hold fails?
  const { mutate: deleteHold, isSuccess: isDeleteHoldSuccess } =
    useDeleteHold();
  const { setSelectedShow, setSelectedShowtime, setSelectedNumberOfTickets } =
    useContext(SelectedShowtimeContext);

  useEffect(() => {
    if (!isDeleteHoldSuccess) return;
    setSelectedShow(undefined);
    setSelectedShowtime(undefined);
    setSelectedNumberOfTickets(NaN);
  }, [
    isDeleteHoldSuccess,
    setSelectedNumberOfTickets,
    setSelectedShow,
    setSelectedShowtime
  ]);

  const todayTixURL = process.env.TODAY_TIX_APP_URL;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content style={styles.cardContainer}>
          <View>
            <Text variant="titleMedium">Seats</Text>
            <Text>{hold.seatsInfo?.sectionName}</Text>
            <Text>{`Row ${hold.seatsInfo?.row}, Seat${pluralize(hold.numSeats)} ${hold.seatsInfo?.seats.join(" and ")}`}</Text>
          </View>
          <View style={styles.rightCardContent}>
            <Text variant="titleMedium">Order Total</Text>
            <Text>{hold.configurableTexts?.amountDisplayForWeb}</Text>
          </View>
        </Card.Content>
      </Card>
      {todayTixURL && (
        <Button mode="contained" onPress={() => Linking.openURL(todayTixURL)}>
          Purchase on TodayTix
        </Button>
      )}
      <Button mode="outlined" onPress={() => deleteHold(hold.id)}>
        Release tickets
      </Button>
    </View>
  );
};

export default HoldConfirmation;

const styles = StyleSheet.create({
  cardContainer: { flexDirection: "row", justifyContent: "space-between" },
  container: { rowGap: 15 },
  rightCardContent: { alignItems: "flex-end" }
});
