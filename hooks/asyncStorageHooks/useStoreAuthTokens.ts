import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeTokens } from "../../store/asyncStorageUtils";

const useStoreAuthTokens = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accessToken,
      refreshToken,
      ttl
    }: {
      accessToken: string;
      refreshToken: string;
      ttl: number;
    }) => storeTokens(accessToken, refreshToken, ttl),
    // Always refetch the access tokens after success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["authTokens"]
      });
    }
  });
};

export default useStoreAuthTokens;
