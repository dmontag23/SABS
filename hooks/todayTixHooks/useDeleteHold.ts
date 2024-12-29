import {useMutation, useQueryClient} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIv2ErrorResponse} from "../../types/base";

const deleteHold = async (holdId: number) =>
  (await todayTixAPIv2.delete<{}>(`holds/${holdId}`)).data.data;

const useDeleteHold = () => {
  const queryClient = useQueryClient();

  return useMutation<{}, TodayTixAPIv2ErrorResponse, number>({
    mutationFn: deleteHold,
    // Always refetch the holds after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["holds"]
      });
    }
  });
};

export default useDeleteHold;
