import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const storeCustomerId = async (customerId: string) => {
  await AsyncStorage.setItem("customer-id", customerId);
  return customerId;
};

const useStoreCustomerId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeCustomerId,
    // Always refetch the customer id after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["customerId"]
      });
    }
  });
};

export default useStoreCustomerId;
