import AsyncStorage from "@react-native-async-storage/async-storage";
import {useQuery} from "@tanstack/react-query";

const getLocationId = async () => {
  const locationId = await AsyncStorage.getItem("location-id");
  if (!locationId) throw Error("No location ID found in local storage.");
  return Number(locationId);
};

const useGetLocationId = () =>
  useQuery({
    queryKey: ["locationId"],
    queryFn: getLocationId
  });

export default useGetLocationId;
