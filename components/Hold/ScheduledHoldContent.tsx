import React, { useContext } from "react";

import { Button } from "react-native-paper";

import HoldContext from "../../store/hold-context";
import SelectedShowtimeContext from "../../store/selected-showtime-context";

const ScheduledHoldContent = () => {
  const { setSelectedShow, setSelectedShowtime, setSelectedNumberOfTickets } =
    useContext(SelectedShowtimeContext);

  const { cancelHold } = useContext(HoldContext);

  return (
    <Button
      mode="outlined"
      onPress={() => {
        cancelHold();
        setSelectedShow(undefined);
        setSelectedShowtime(undefined);
        setSelectedNumberOfTickets(NaN);
      }}
    >
      Cancel
    </Button>
  );
};

export default ScheduledHoldContent;
