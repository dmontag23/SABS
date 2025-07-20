import { useQuery } from "@tanstack/react-query";

import { todayTixAPIv2 } from "../../api/axiosConfig";
import { TodayTixAPIv2ErrorResponse } from "../../types/base";
import { TodayTixRushGrant } from "../../types/rushGrants";

const getRushGrants = async () =>
  (await todayTixAPIv2.get<TodayTixRushGrant[]>("customers/me/rushGrants")).data
    .data;

type UseGetRushGrantsProps = {
  enabled?: boolean;
};
const useGetRushGrants = ({ enabled }: UseGetRushGrantsProps = {}) =>
  useQuery<TodayTixRushGrant[], TodayTixAPIv2ErrorResponse>({
    queryKey: ["rushGrants"],
    queryFn: getRushGrants,
    enabled
  });

export default useGetRushGrants;
