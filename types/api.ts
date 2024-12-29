import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";

import {TodayTixAPIv2Response} from "./base";

// TODO: Extend these types if possible to include the custom headers set in the request and response interceptors

export interface AxiosTodayTixAPIv2Response<T = unknown>
  extends AxiosResponse<TodayTixAPIv2Response<T>> {}

export interface TodayTixAPIv2AxiosInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInstance["interceptors"]["request"];
    response: AxiosInterceptorManager<AxiosTodayTixAPIv2Response>;
  };
  request<T = unknown, R = AxiosTodayTixAPIv2Response<T>, D = unknown>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
  get<T = unknown, R = AxiosTodayTixAPIv2Response<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  delete<T = unknown, R = AxiosTodayTixAPIv2Response<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  head<T = unknown, R = AxiosTodayTixAPIv2Response<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  options<T = unknown, R = AxiosTodayTixAPIv2Response<T>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  post<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  put<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patch<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  postForm<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  putForm<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patchForm<D = unknown, T = unknown, R = AxiosTodayTixAPIv2Response<T>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}
