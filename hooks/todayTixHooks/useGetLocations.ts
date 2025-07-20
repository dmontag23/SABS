import { useQuery } from "@tanstack/react-query";

import { todayTixAPIv2 } from "../../api/axiosConfig";
import { TodayTixAPIv2ErrorResponse } from "../../types/base";
import { TodayTixLocation } from "../../types/locations";

const getLocations = async () =>
  (await todayTixAPIv2.get<TodayTixLocation[]>("locations")).data.data;

const useGetLocations = () =>
  useQuery<TodayTixLocation[], TodayTixAPIv2ErrorResponse>({
    queryKey: ["locations"],
    queryFn: getLocations
  });

export default useGetLocations;
