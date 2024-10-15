import React, {useContext, useEffect, useMemo, useRef} from "react";
import {Linking, StyleSheet, View} from "react-native";

import BottomSheet from "@gorhom/bottom-sheet";
import {Button, Card, Text, useTheme} from "react-native-paper";

import {pluralize} from "../utils";

import useDeleteHold from "../../hooks/todayTixHooks/useDeleteHold";
import HoldContext from "../../store/hold-context";
import SelectedShowtimeContext from "../../store/selected-showtime-context";

const MIN_HEIGHT = 10;
const MAX_HEIGHT = "53%";

type HoldConfirmationBottomSheetProps = {
  bottomInset?: number;
};

const HoldConfirmationBottomSheet = ({
  bottomInset = 0
}: HoldConfirmationBottomSheetProps) => {
  const {colors} = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [`${MIN_HEIGHT}%`, MAX_HEIGHT], []);

  const {setSelectedShow, setSelectedShowtime, setSelectedNumberOfTickets} =
    useContext(SelectedShowtimeContext);
  const {hold} = useContext(HoldContext);

  // TODO: Add an error here on the page if deleting the hold fails?
  const {mutate: deleteHold, isSuccess: isDeleteHoldSuccess} = useDeleteHold();

  useEffect(
    () =>
      hold ? bottomSheetRef.current?.expand() : bottomSheetRef.current?.close(),
    [hold]
  );

  useEffect(() => {
    if (isDeleteHoldSuccess) {
      setSelectedShow(undefined);
      setSelectedShowtime(undefined);
      setSelectedNumberOfTickets(NaN);
    }
  }, [
    isDeleteHoldSuccess,
    setSelectedNumberOfTickets,
    setSelectedShow,
    setSelectedShowtime
  ]);

  const todayTixURL = process.env.TODAY_TIX_APP_URL;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableOverDrag={false}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      index={hold ? 1 : -1}
      bottomInset={bottomInset}
      style={[styles.modalContainer, {borderColor: colors.primary}]}>
      {hold && (
        <View style={styles.contentContainer}>
          <Text
            variant="titleMedium"
            style={
              styles.headerText
            }>{`You've won ${hold.numSeats} ticket${pluralize(hold.numSeats)} to ${hold.showtime.show?.displayName} 🎉`}</Text>
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
          <Text style={styles.warningText}>
            IMPORTANT: Hard-close the TodayTix app before pressing the Purchase
            button!
          </Text>
          {todayTixURL && (
            <Button
              mode="contained"
              onPress={() => Linking.openURL(todayTixURL)}
              style={styles.button}>
              Purchase on TodayTix
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={() => deleteHold(hold.id)}
            style={styles.button}>
            Release tickets
          </Button>
        </View>
      )}
    </BottomSheet>
  );
};
export default HoldConfirmationBottomSheet;

const styles = StyleSheet.create({
  /* To work around a bug, the height on the button is set so the text doesn't get cutoff, see 
  https://github.com/gorhom/react-native-bottom-sheet/issues/1867 */
  button: {height: 40},
  cardContainer: {flexDirection: "row", justifyContent: "space-between"},
  contentContainer: {marginHorizontal: 15, rowGap: 20},
  headerText: {height: `${MIN_HEIGHT + 1}%`, textAlign: "center"},
  modalContainer: {borderTopWidth: 3},
  rightCardContent: {alignItems: "flex-end"},
  warningText: {fontWeight: "bold"}
});
