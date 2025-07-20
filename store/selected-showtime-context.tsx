import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState
} from "react";

import { TodayTixShow } from "../types/shows";
import { TodayTixShowtime } from "../types/showtimes";

const SelectedShowtimeContext = createContext<{
  selectedShow?: TodayTixShow;
  selectedShowtime?: TodayTixShowtime;
  selectedNumberOfTickets?: number;
  setSelectedShow: Dispatch<SetStateAction<TodayTixShow | undefined>>;
  setSelectedShowtime: Dispatch<SetStateAction<TodayTixShowtime | undefined>>;
  setSelectedNumberOfTickets: Dispatch<SetStateAction<number>>;
}>({
  setSelectedShow: () => {},
  setSelectedShowtime: () => {},
  setSelectedNumberOfTickets: () => {}
});

export const SelectedShowtimeContextProvider = ({
  children
}: PropsWithChildren) => {
  const [show, setShow] = useState<TodayTixShow>();
  const [showtime, setShowtime] = useState<TodayTixShowtime>();
  const [numberOfTickets, setNumberOfTickets] = useState(NaN);

  return (
    <SelectedShowtimeContext.Provider
      value={{
        selectedShow: show,
        selectedShowtime: showtime,
        selectedNumberOfTickets: numberOfTickets,
        setSelectedShow: setShow,
        setSelectedShowtime: setShowtime,
        setSelectedNumberOfTickets: setNumberOfTickets
      }}
    >
      {children}
    </SelectedShowtimeContext.Provider>
  );
};

export default SelectedShowtimeContext;
