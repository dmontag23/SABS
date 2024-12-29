import React, {PropsWithChildren, createContext} from "react";

import {MutateOptions} from "@tanstack/react-query";

import useGetHold from "../hooks/todayTixHooks/useGetHold";
import usePostHolds, {
  PostHoldsVariables
} from "../hooks/todayTixHooks/usePostHolds";
import useScheduleCallback from "../hooks/useScheduleCallback";
import {TodayTixAPIv2ErrorResponse} from "../types/base";
import {TodayTixHold} from "../types/holds";

const HoldContext = createContext<{
  isCreatingHold: boolean;
  createHoldError: TodayTixAPIv2ErrorResponse | null;
  isHoldScheduled: boolean;
  scheduleHold: (
    runAtEpochTimeInSeconds: number,
    variables: PostHoldsVariables,
    options?:
      | MutateOptions<
          TodayTixHold,
          TodayTixAPIv2ErrorResponse,
          PostHoldsVariables
        >
      | undefined
  ) => void;
  cancelHold: () => void;
  hold?: TodayTixHold;
}>({
  isCreatingHold: false,
  createHoldError: null,
  isHoldScheduled: false,
  scheduleHold: () => {},
  cancelHold: () => {}
});

export const HoldContextProvider = ({children}: PropsWithChildren) => {
  const {data: hold} = useGetHold();

  const {
    mutate: createHold,
    isPending: isCreatingHold,
    error: createHoldError,
    reset: resetCreateHold
  } = usePostHolds();

  const {
    scheduleCallback: scheduleHold,
    cancelScheduledExecution: cancelScheduledHold,
    isScheduled: isHoldScheduled
  } = useScheduleCallback(createHold);

  const cancelHold = () => {
    cancelScheduledHold();
    /* resetCreateHold is executed here so that, if the hold previously 
    errored and a new showtime is clicked, the request is reset. */
    resetCreateHold();
  };

  return (
    <HoldContext.Provider
      value={{
        isCreatingHold,
        createHoldError,
        isHoldScheduled,
        scheduleHold,
        cancelHold,
        hold
      }}>
      {children}
    </HoldContext.Provider>
  );
};

export default HoldContext;
