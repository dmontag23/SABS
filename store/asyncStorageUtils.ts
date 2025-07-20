import AsyncStorage from "@react-native-async-storage/async-storage";

export const getTokens = async () => {
  try {
    return await AsyncStorage.multiGet([
      "access-token",
      "refresh-token",
      "token-ttl"
    ]);
  } catch (error: unknown) {
    return Promise.reject({
      name: "Cannot fetch AsyncStorage token data",
      message: `An error occurred when trying to fetch the token from storage: ${JSON.stringify(error)}`
    });
  }
};

export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
  ttl: number
) => {
  try {
    // TODO: Use secure storage for tokens instead
    await AsyncStorage.multiSet([
      ["access-token", accessToken],
      ["refresh-token", refreshToken],
      ["token-ttl", ttl.toString()]
    ]);
    return { accessToken, refreshToken, ttl };
  } catch (error: unknown) {
    return Promise.reject({
      name: "Cannot store AsyncStorage token data",
      message: `An error occurred when trying to store the access token ${accessToken}, refresh token ${refreshToken}, and ttl ${ttl}: ${JSON.stringify(error)}`
    });
  }
};
