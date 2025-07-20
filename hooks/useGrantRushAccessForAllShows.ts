import { useEffect, useMemo, useState } from "react";

import useGetRushGrants from "./todayTixHooks/useGetRushGrants";
import usePostRushGrants from "./todayTixHooks/usePostRushGrants";
import useGetCustomerId from "./useGetCustomerId";

import { TodayTixShow } from "../types/shows";

const useGrantRushAccessForAllShows = (shows: TodayTixShow[]) => {
  /* This piece of state ensures that isGrantingAccess is still true between the
  network requests needed to unlock the rush grants, if any. */
  const [areMoreGrantsToFetch, setAreMoreGrantsToFetch] = useState(true);

  const { customerId, isPending: isGetCustomerIdPending } = useGetCustomerId();

  const {
    data: rushGrants,
    isFetching: isGetRushGrantsPending,
    isSuccess: isGetRushGrantsSuccess,
    refetch: refetchRushGrants
  } = useGetRushGrants({ enabled: Boolean(customerId) });

  const {
    mutate: grantAccessToShow,
    isPending: isPostRushGrantsPending,
    isSuccess: isPostRushGrantsSuccess,
    isError: isPostRushGrantsError
  } = usePostRushGrants();

  const allGrantedRushShowIds = useMemo(
    () => rushGrants?.map(grant => grant.showId),
    [rushGrants]
  );

  const showIdsToGrantRushAccessTo = useMemo(
    () =>
      isGetRushGrantsSuccess
        ? shows.reduce<number[]>(
            (rushShowIds, { showId }) =>
              showId && !allGrantedRushShowIds?.includes(showId)
                ? [...rushShowIds, showId]
                : rushShowIds,
            []
          )
        : [],
    [allGrantedRushShowIds, isGetRushGrantsSuccess, shows]
  );

  useEffect(() => {
    setAreMoreGrantsToFetch(
      Boolean(customerId && showIdsToGrantRushAccessTo.length)
    );
    if (customerId)
      showIdsToGrantRushAccessTo.forEach(showId =>
        grantAccessToShow({ customerId, showId })
      );
  }, [customerId, grantAccessToShow, showIdsToGrantRushAccessTo]);

  useEffect(() => {
    if (isPostRushGrantsSuccess || isPostRushGrantsError) {
      refetchRushGrants();
      setAreMoreGrantsToFetch(false);
    }
  }, [isPostRushGrantsError, isPostRushGrantsSuccess, refetchRushGrants]);

  return {
    isGrantingAccess:
      isGetCustomerIdPending ||
      isGetRushGrantsPending ||
      isPostRushGrantsPending ||
      areMoreGrantsToFetch,
    rushGrants: rushGrants ?? []
  };
};

export default useGrantRushAccessForAllShows;
