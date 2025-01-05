import AsyncStorage from "@react-native-async-storage/async-storage";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const storeLocation = async (locationId: number) => {
  await AsyncStorage.setItem("location-id", locationId.toString());
  return locationId;
};

const useStoreLocationId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeLocation,
    // Always refetch the location ID after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["locationId"]
      });
    }
  });
};

export default useStoreLocationId;
