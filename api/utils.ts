import {AxiosHeaders, InternalAxiosRequestConfig} from "axios";

import {todayTixOAuthAPI} from "./axiosConfig";

import {log} from "../config/logger";
import {getTokens, storeTokens} from "../store/asyncStorageUtils";
import {AxiosTodayTixAPIv2Response} from "../types/api";
import {
  TodayTixClient,
  TodayTixGrantType,
  TodayTixRefreshTokenReq,
  TodayTixRefreshTokenRes
} from "../types/loginTokens";

const refetchToken = async (prevAccessToken: string, refreshToken: string) => {
  try {
    return await todayTixOAuthAPI.post<
      TodayTixRefreshTokenReq,
      TodayTixRefreshTokenRes
    >("token", {
      client_id: TodayTixClient.IOS,
      grant_type: TodayTixGrantType.Refresh,
      parent_token: prevAccessToken,
      refresh_token: refreshToken
    });
  } catch (error: unknown) {
    return Promise.reject({
      name: "Cannot refresh token",
      message: `An error occurred when trying to refresh the access token: ${prevAccessToken} with refresh token: ${refreshToken}: ${JSON.stringify(error)}`
    });
  }
};

const refreshAndStoreNewAccessToken = async (
  accessToken: string,
  refreshToken: string
) => {
  const {access_token: newAccessToken, expires_in} = await refetchToken(
    accessToken,
    refreshToken
  );
  await storeTokens(
    newAccessToken,
    refreshToken,
    new Date().getTime() + expires_in * 1000
  );
  return newAccessToken;
};

export const REQUEST_DURATION_HEADER_NAME = "request-duration";
export const REQUEST_START_TIME_HEADER_NAME = "request-start-time";

export const handleTodayTixApiRequest = async (
  request: InternalAxiosRequestConfig
) => {
  const [accessTokenPair, refreshTokenPair, tokenTTLPair] = await getTokens();
  const currentAccessToken = accessTokenPair[1] ?? "";
  const refreshToken = refreshTokenPair[1] ?? "";
  const ttl = Number(tokenTTLPair[1] ?? 0);

  // The buffer time (in ms) is the amount of time before the ttl at which to fetch a new token
  const bufferTime = 5000;
  const now = new Date().getTime();
  const isTokenExpired = now >= ttl - bufferTime;

  const accessToken =
    currentAccessToken && refreshToken && isTokenExpired
      ? await refreshAndStoreNewAccessToken(currentAccessToken, refreshToken)
      : currentAccessToken;

  log.debug(
    "Making a TodayTix API v2 request: ",
    request.method,
    request.baseURL,
    request.url,
    request.data
  );
  return {
    ...request,
    headers: new AxiosHeaders({
      ...request.headers,
      Authorization: `Bearer ${accessToken}`,
      [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime()
    })
  };
};

export const handleTodayTixApiResponse = (
  response: AxiosTodayTixAPIv2Response
) => ({
  ...response,
  headers: new AxiosHeaders({
    ...response.headers,
    [REQUEST_DURATION_HEADER_NAME]:
      new Date().getTime() -
      response.config.headers[REQUEST_START_TIME_HEADER_NAME]
  })
});
