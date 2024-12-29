import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIv2ErrorResponse} from "../../types/base";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow,
  TodayTixShowsReqQueryParams
} from "../../types/shows";

const getShows = async (
  areAccessProgramsActive?: boolean,
  fieldset?: TodayTixFieldset,
  limit?: number,
  location?: TodayTixLocation,
  offset?: number
) => {
  const queryParams = [
    areAccessProgramsActive && "areAccessProgramsActive=1",
    fieldset && `fieldset=${fieldset}`,
    limit && `limit=${limit}`,
    location && `location=${location}`,
    offset && `offset=${offset}`
  ]
    .filter(param => param)
    .join("&");
  return (
    await todayTixAPIv2.get<TodayTixShow[]>(
      `shows${queryParams ? `?${queryParams}` : ""}`
    )
  ).data.data;
};

type UseGetShowsProps = {
  requestParams?: TodayTixShowsReqQueryParams;
  enabled?: boolean;
};

const useGetShows = ({
  requestParams = {},
  enabled = true
}: UseGetShowsProps = {}) => {
  const {areAccessProgramsActive, fieldset, limit, location, offset} =
    requestParams;

  return useQuery<TodayTixShow[], TodayTixAPIv2ErrorResponse>({
    queryKey: [
      "shows",
      areAccessProgramsActive,
      fieldset,
      limit,
      location,
      offset
    ],
    queryFn: () =>
      getShows(areAccessProgramsActive, fieldset, limit, location, offset),
    enabled
  });
};

export default useGetShows;
