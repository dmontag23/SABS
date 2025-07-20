import { useMutation, useQueryClient } from "@tanstack/react-query";

import { todayTixAPIv2 } from "../../api/axiosConfig";
import { TodayTixAPIv2ErrorResponse } from "../../types/base";
import {
  TodayTixHold,
  TodayTixHoldErrorCode,
  TodayTixHoldType,
  TodayTixHoldsReq
} from "../../types/holds";

const isRushLocked = ({ message }: TodayTixAPIv2ErrorResponse) =>
  Boolean(message?.includes("unlock Rush"));

export const isShadowBlocked = ({
  error,
  context
}: TodayTixAPIv2ErrorResponse) =>
  error === TodayTixHoldErrorCode.SEATS_TAKEN &&
  Array.isArray(context) &&
  context[0].includes("Unfortunately");

export type PostHoldsVariables = {
  customerId: string;
  showtimeId: number;
  numTickets: number;
};

const postHolds = async ({
  customerId,
  showtimeId,
  numTickets
}: PostHoldsVariables) =>
  (
    await todayTixAPIv2.post<TodayTixHoldsReq, TodayTixHold>(`holds`, {
      customer: customerId,
      showtime: showtimeId,
      numTickets,
      holdType: TodayTixHoldType.Rush
    })
  ).data.data;

const usePostHolds = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TodayTixHold,
    TodayTixAPIv2ErrorResponse,
    PostHoldsVariables
  >({
    mutationFn: postHolds,
    retry: (failureCount, error) =>
      /* failureCount < 59 will try the mutation at most 60 times before failing.
      This is because failureCount is the number of previous failures of the hook,
      not current failures. So the first time the hook fails, failureCount=0, so the
      60th time the hook fails, failureCount=59. At this point, the hook should stop
      retrying, i.e. the function below should return false. */
      error.code === 409 &&
      !isRushLocked(error) &&
      !isShadowBlocked(error) &&
      failureCount < 59,
    retryDelay: 0,
    // Only refetch the holds on a successful post call
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["holds"]
      });
    }
  });
};

export default usePostHolds;
