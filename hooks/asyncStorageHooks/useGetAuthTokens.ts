import { useQuery } from "@tanstack/react-query";

import { getTokens } from "../../store/asyncStorageUtils";

const getAllTokenData = async () => {
  const tokens = await getTokens();
  return {
    accessToken: tokens[0][1],
    refreshToken: tokens[1][1],
    ttl: Number(tokens[2][1])
  };
};

const useGetAuthTokens = () =>
  useQuery({
    queryKey: ["authTokens"],
    queryFn: getAllTokenData
  });

export default useGetAuthTokens;
