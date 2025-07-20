import { useEffect, useState } from "react";

import useGetAuthTokens from "./asyncStorageHooks/useGetAuthTokens";
import useGetCustomerIdFromAsyncStorage from "./asyncStorageHooks/useGetCustomerIdFromAsyncStorage";
import useStoreCustomerId from "./asyncStorageHooks/useStoreCustomerId";
import useGetCustomersMe from "./todayTixHooks/useGetCustomersMe";

const useGetCustomerId = () => {
  /* This piece of state ensures that isPending is still true between the time the customer
  is retrieved from TodayTix and the mutation that needs to be fired in order to save
  that customer in AsyncStorage. */
  const [hasCalledStoreCustomerMutation, setHasCalledStoreCustomerMutation] =
    useState(false);

  const { data: authTokens, isPending: isGetAuthTokensPending } =
    useGetAuthTokens();

  const {
    data: customerIdFromAsyncStorage,
    isPending: isGetCustomerIdFromAsyncStoragePending,
    isSuccess: isGetCustomerIdFromAsyncStorageSuccess
  } = useGetCustomerIdFromAsyncStorage();

  const shouldFetchCustomerFromTodayTixAPI =
    isGetCustomerIdFromAsyncStorageSuccess && !customerIdFromAsyncStorage;

  const {
    data: customerFromTodayTix,
    isSuccess: isGetCustomerFromTodayTixSuccess
  } = useGetCustomersMe({
    enabled:
      shouldFetchCustomerFromTodayTixAPI &&
      Boolean(authTokens?.accessToken && authTokens.refreshToken)
  });

  const {
    mutate: storeCustomerIdInAsyncStorage,
    isPending: isStoreCustomerIdInAsyncStoragePending,
    isSuccess: isStoreCustomerIdInAsyncStorageSuccess
  } = useStoreCustomerId();

  useEffect(() => {
    if (isGetCustomerFromTodayTixSuccess) {
      storeCustomerIdInAsyncStorage(customerFromTodayTix.id);
      setHasCalledStoreCustomerMutation(true);
    }
  }, [
    customerFromTodayTix,
    isGetCustomerFromTodayTixSuccess,
    storeCustomerIdInAsyncStorage
  ]);

  return {
    customerId: customerIdFromAsyncStorage ?? customerFromTodayTix?.id,
    isPending:
      isGetAuthTokensPending ||
      isGetCustomerIdFromAsyncStoragePending ||
      (shouldFetchCustomerFromTodayTixAPI && !hasCalledStoreCustomerMutation) ||
      isStoreCustomerIdInAsyncStoragePending,
    isSuccess: shouldFetchCustomerFromTodayTixAPI
      ? isGetCustomerFromTodayTixSuccess &&
        isStoreCustomerIdInAsyncStorageSuccess
      : isGetCustomerIdFromAsyncStorageSuccess
  };
};

export default useGetCustomerId;
