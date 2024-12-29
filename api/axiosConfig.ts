import axios from "axios";

import {handleTodayTixApiRequest, handleTodayTixApiResponse} from "./utils";

import {log} from "../config/logger";
import {TodayTixAPIv2AxiosInstance} from "../types/api";

export const todayTixOAuthAPI = axios.create({
  baseURL: `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_OAUTH_ENDPOINT}`,
  headers: {"Content-Type": "application/x-www-form-urlencoded"}
});

todayTixOAuthAPI.interceptors.response.use(
  response => response.data,
  errorResponse => {
    const error = errorResponse.response.data;
    log.warn("Error from the TodayTix OAuth API: ", error);
    return Promise.reject(error);
  }
);

export const todayTixAPIv2: TodayTixAPIv2AxiosInstance = axios.create({
  baseURL: `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`,
  headers: {"Content-Type": "application/json"}
});

todayTixAPIv2.interceptors.request.use(handleTodayTixApiRequest);

todayTixAPIv2.interceptors.response.use(
  handleTodayTixApiResponse,
  errorResponse => {
    const error = errorResponse.response?.data ?? errorResponse.response;
    log.warn("Error from the TodayTix v2 API: ", error);
    /* TODO: It may be worth creating a custom error object to unify the errors across the app. 
    This would allow https://tanstack.com/query/latest/docs/framework/react/typescript#typing-the-error-field to be used. */
    return Promise.reject(error);
  }
);
