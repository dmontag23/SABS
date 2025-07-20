import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "react-native-paper";

import HoldConfirmationContent from "./HoldConfirmationContent";
import HoldErrorContent from "./HoldErrorContent";
import ScheduledHoldContent from "./ScheduledHoldContent";

import BottomSheet from "../ui/BottomSheet";
import LoadingSpinner from "../ui/LoadingSpinner";
import { pluralize } from "../utils";

import { isShadowBlocked } from "../../hooks/todayTixHooks/usePostHolds";
import useCountdown from "../../hooks/useCountdown";
import HoldContext from "../../store/hold-context";
import SelectedShowtimeContext from "../../store/selected-showtime-context";

const createHeaderText = (text: string) => (
  <Text variant="titleMedium" style={styles.headerTitle}>
    {text}
  </Text>
);

type HoldConfirmationBottomSheetProps = {
  bottomInset?: number;
};

const HoldConfirmationBottomSheet = ({
  bottomInset = 0
}: HoldConfirmationBottomSheetProps) => {
  const {
    selectedShow: show,
    selectedShowtime: showtime,
    selectedNumberOfTickets: numberOfTickets
  } = useContext(SelectedShowtimeContext);

  const { isHoldScheduled, isCreatingHold, createHoldError, hold } =
    useContext(HoldContext);

  const isVisible = Boolean(
    isHoldScheduled || isCreatingHold || createHoldError || hold
  );

  const { countdown: countdownToRushOpening } = useCountdown(
    showtime?.rushTickets?.availableAfterEpoch
  );

  const getBannerInfo = () => {
    if (isHoldScheduled)
      return {
        header: createHeaderText(
          `Attempting to get ${numberOfTickets} ticket${pluralize(numberOfTickets)} for ${show?.displayName} in ${countdownToRushOpening}`
        ),
        content: <ScheduledHoldContent />
      };
    if (isCreatingHold)
      return {
        header: (
          <View style={styles.isCreatingHoldHeaderContainer}>
            {createHeaderText(
              `Fetching ${numberOfTickets} ticket${pluralize(numberOfTickets)} to ${show?.displayName}`
            )}
            <LoadingSpinner />
          </View>
        )
      };
    if (createHoldError) {
      const shadowBlock = isShadowBlocked(createHoldError);
      return {
        header: createHeaderText(
          shadowBlock
            ? "You've been shadow blocked!"
            : `Error getting tickets to ${show?.displayName}`
        ),
        content: (
          <HoldErrorContent
            message={
              shadowBlock
                ? "TodayTix is putting you at the back of the queue. You can try to get tickets again, but you will only get them if someone else does not ask for them too. Please create a new TodayTix account to ensure you get tickets."
                : createHoldError.message ?? createHoldError.error
            }
          />
        )
      };
    }
    if (hold)
      return {
        header: createHeaderText(
          `You've won ${hold.numSeats} ticket${pluralize(hold.numSeats)} to ${hold.showtime.show?.displayName} 🎉`
        ),
        content: <HoldConfirmationContent hold={hold} />
      };
  };

  const bannerInfo = getBannerInfo();

  return (
    <BottomSheet
      isOpen={isVisible}
      bottomInset={bottomInset}
      header={bannerInfo?.header}
      content={bannerInfo?.content}
    />
  );
};

export default HoldConfirmationBottomSheet;

const styles = StyleSheet.create({
  headerTitle: { textAlign: "center" },
  isCreatingHoldHeaderContainer: { flexDirection: "row", columnGap: 15 }
});
