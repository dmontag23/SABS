import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Text } from "react-native-paper";

import useGetCustomerId from "../../hooks/useGetCustomerId";
import HoldContext from "../../store/hold-context";
import SelectedShowtimeContext from "../../store/selected-showtime-context";
import { TodayTixShow } from "../../types/shows";
import { TodayTixShowtime } from "../../types/showtimes";

type RushShowTicketSelectionProps = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
};

const RushShowTicketSelection = ({
  show,
  showtimes
}: RushShowTicketSelectionProps) => {
  const { customerId } = useGetCustomerId();
  const {
    selectedShowtime,
    selectedNumberOfTickets,
    setSelectedShow,
    setSelectedShowtime,
    setSelectedNumberOfTickets
  } = useContext(SelectedShowtimeContext);
  const { scheduleHold, cancelHold, hold } = useContext(HoldContext);

  /* The numberOfTickets array only shows if a showtime is the same as the
  selectedShowtime (this is checked below), and so it is okay to use the
  selectedShowtime here instead of the showtime from the showtimes prop. */
  const minNumberOfTickets = selectedShowtime?.rushTickets?.minTickets ?? 0;
  const maxNumberOfTickets = selectedShowtime?.rushTickets?.maxTickets ?? 0;
  const numberOfTickets = Array.from(
    { length: maxNumberOfTickets - minNumberOfTickets + 1 },
    (_, x) => x + minNumberOfTickets
  ).filter(number => number !== 0);

  return (
    <View style={styles.container}>
      <Text variant="displaySmall">{show.displayName}</Text>
      <View style={styles.selectionContainer}>
        <Text variant="titleLarge">
          {showtimes.length
            ? "Select a Time"
            : "There are no rush shows currently available."}
        </Text>
        <View style={styles.selectionButtonsContainer}>
          {showtimes.map(showtime => {
            const isSelected = showtime.id === selectedShowtime?.id;
            return (
              <Button
                key={showtime.id}
                disabled={Boolean(hold)}
                onPress={() => {
                  cancelHold();
                  setSelectedShow(show);
                  setSelectedShowtime(showtime);
                  setSelectedNumberOfTickets(NaN);
                }}
                mode={isSelected ? "contained" : "outlined"}
                contentStyle={styles.selectionButton}
              >
                {showtime.localTime}
              </Button>
            );
          })}
        </View>
      </View>
      {customerId &&
        selectedShowtime &&
        showtimes.some(({ id }) => id === selectedShowtime.id) && (
          <View style={styles.selectionContainer}>
            <Text variant="titleLarge">Number of Tickets</Text>
            <View style={styles.selectionButtonsContainer}>
              {numberOfTickets.map(number => {
                const isSelected = number === selectedNumberOfTickets;
                return (
                  <Button
                    key={number}
                    disabled={Boolean(hold)}
                    onPress={() => {
                      cancelHold();
                      setSelectedNumberOfTickets(number);
                      scheduleHold(
                        (selectedShowtime.rushTickets?.availableAfterEpoch ??
                          0) - 1,
                        {
                          customerId,
                          showtimeId: selectedShowtime.id,
                          numTickets: number
                        }
                      );
                    }}
                    mode={isSelected ? "contained" : "outlined"}
                    contentStyle={styles.selectionButton}
                  >
                    {number}
                  </Button>
                );
              })}
            </View>
          </View>
        )}
    </View>
  );
};

export default RushShowTicketSelection;

const styles = StyleSheet.create({
  container: { alignItems: "center", rowGap: 30 },
  selectionButton: { minWidth: 100, minHeight: 80 },
  selectionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 15,
    columnGap: 50,
    width: "100%"
  },
  selectionContainer: { alignItems: "center", rowGap: 10 }
});
