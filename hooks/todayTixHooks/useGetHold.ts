import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIv2ErrorResponse} from "../../types/base";
import {TodayTixHold} from "../../types/holds";

const getHold = async () => {
  const {data} = await todayTixAPIv2.get<TodayTixHold[]>("holds");

  // It seems TodayTix only ever lets you have one hold at a time
  return data.data[0] ?? null;
};

const useGetHold = () =>
  useQuery<TodayTixHold, TodayTixAPIv2ErrorResponse>({
    queryKey: ["holds"],
    queryFn: getHold
  });

export default useGetHold;
