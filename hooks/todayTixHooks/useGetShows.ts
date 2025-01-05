import {useQuery} from "@tanstack/react-query";

import {todayTixAPIv2} from "../../api/axiosConfig";
import {TodayTixAPIv2ErrorResponse} from "../../types/base";
import {
  TodayTixFieldset,
  TodayTixShow,
  TodayTixShowsReqQueryParams
} from "../../types/shows";

const getShows = async (
  areAccessProgramsActive?: boolean,
  fieldset?: TodayTixFieldset,
  limit?: number,
  locationId?: number,
  offset?: number
) => {
  const queryParams = [
    areAccessProgramsActive && "areAccessProgramsActive=1",
    fieldset && `fieldset=${fieldset}`,
    limit && `limit=${limit}`,
    locationId && `location=${locationId}`,
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
  requestParams?: Omit<TodayTixShowsReqQueryParams, "location"> & {
    locationId?: number;
  };
  enabled?: boolean;
};

const useGetShows = ({
  requestParams = {},
  enabled = true
}: UseGetShowsProps = {}) => {
  const {areAccessProgramsActive, fieldset, limit, locationId, offset} =
    requestParams;

  return useQuery<TodayTixShow[], TodayTixAPIv2ErrorResponse>({
    queryKey: [
      "shows",
      areAccessProgramsActive,
      fieldset,
      limit,
      locationId,
      offset
    ],
    queryFn: () =>
      getShows(areAccessProgramsActive, fieldset, limit, locationId, offset),
    enabled
  });
};

export default useGetShows;
