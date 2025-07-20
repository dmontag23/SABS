import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

const getCustomerId = () => AsyncStorage.getItem("customer-id");

const useGetCustomerIdFromAsyncStorage = () =>
  useQuery({
    queryKey: ["customerId"],
    queryFn: getCustomerId
  });

export default useGetCustomerIdFromAsyncStorage;
