import {describe, expect, it} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AxiosHeaders} from "axios";
import nock from "nock";

import {
  REQUEST_DURATION_HEADER_NAME,
  REQUEST_START_TIME_HEADER_NAME,
  handleTodayTixApiRequest,
  handleTodayTixApiResponse
} from "../utils";

import {TodayTixClient, TodayTixGrantType} from "../../types/loginTokens";

describe("API utils", () => {
  describe("handleTodayTixApiRequest", () => {
    it("does not refresh token if there is no access token", async () => {
      await AsyncStorage.setItem("refresh-token", "refresh-token");

      expect(
        await handleTodayTixApiRequest({
          headers: new AxiosHeaders()
        })
      ).toHaveProperty(
        "headers",
        new AxiosHeaders({
          Authorization: `Bearer `,
          [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime()
        })
      );
    });

    it("does not refresh token if there is no refresh token", async () => {
      await AsyncStorage.setItem("access-token", "current-access-token");

      expect(
        await handleTodayTixApiRequest({
          headers: new AxiosHeaders()
        })
      ).toHaveProperty(
        "headers",
        new AxiosHeaders({
          Authorization: `Bearer current-access-token`,
          [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime()
        })
      );
    });

    it("does not refresh token if the token is not expired", async () => {
      await AsyncStorage.setItem("access-token", "current-access-token");
      await AsyncStorage.setItem("refresh-token", "refresh-token");
      await AsyncStorage.setItem(
        "token-ttl",
        new Date("05-23-2021 00:00:05:01").getTime().toString()
      );

      expect(
        await handleTodayTixApiRequest({
          headers: new AxiosHeaders()
        })
      ).toHaveProperty(
        "headers",
        new AxiosHeaders({
          Authorization: `Bearer current-access-token`,
          [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime()
        })
      );
    });

    it("refreshes the token when it expires", async () => {
      await AsyncStorage.setItem("access-token", "current-access-token");
      await AsyncStorage.setItem("refresh-token", "refresh-token");
      await AsyncStorage.setItem(
        "token-ttl",
        new Date("05-23-2021 00:00:05").getTime().toString()
      );
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_OAUTH_ENDPOINT}`
      )
        .post("/token", {
          client_id: TodayTixClient.IOS,
          grant_type: TodayTixGrantType.Refresh,
          parent_token: "current-access-token",
          refresh_token: "refresh-token"
        })
        .reply(200, {
          access_token: "new-access-token",
          token_type: "Bearer",
          original_token_id: "65c8b405a5a4f70001f6ae20",
          expires_in: 1800,
          scope: "customer"
        });

      expect(
        await handleTodayTixApiRequest({
          headers: new AxiosHeaders()
        })
      ).toHaveProperty(
        "headers",
        new AxiosHeaders({
          Authorization: `Bearer new-access-token`,
          [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime()
        })
      );

      expect(await AsyncStorage.getItem("access-token")).toBe(
        "new-access-token"
      );
      expect(await AsyncStorage.getItem("refresh-token")).toBe("refresh-token");
      expect(await AsyncStorage.getItem("token-ttl")).toBe(
        new Date("05-23-2021 00:30").getTime().toString()
      );
    });

    it("throws an error when the api endpoint errors", async () => {
      await AsyncStorage.setItem("access-token", "current-access-token");
      await AsyncStorage.setItem("refresh-token", "refresh-token");
      await AsyncStorage.setItem(
        "token-ttl",
        new Date("05-23-2021 00:00:05").getTime().toString()
      );
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_OAUTH_ENDPOINT}`
      )
        .post("/token", {
          client_id: TodayTixClient.IOS,
          grant_type: TodayTixGrantType.Refresh,
          parent_token: "current-access-token",
          refresh_token: "refresh-token"
        })
        .reply(400, {
          error_description: "Request is missing username parameter.",
          error: "invalid_request"
        });

      await expect(
        handleTodayTixApiRequest({
          headers: new AxiosHeaders()
        })
      ).rejects.toEqual({
        name: "Cannot refresh token",
        message: `An error occurred when trying to refresh the access token: current-access-token with refresh token: refresh-token: ${JSON.stringify(
          {
            error_description: "Request is missing username parameter.",
            error: "invalid_request"
          }
        )}`
      });
    });
  });

  describe("handleTodayTixApiResponse", () =>
    it("returns the correct duration header", () =>
      expect(
        handleTodayTixApiResponse({
          data: {code: 0, data: undefined},
          status: 0,
          statusText: "",
          headers: new AxiosHeaders(),
          config: {
            headers: new AxiosHeaders({
              [REQUEST_START_TIME_HEADER_NAME]: new Date().getTime() - 4000
            })
          }
        })
      ).toHaveProperty(
        "headers",
        new AxiosHeaders({[REQUEST_DURATION_HEADER_NAME]: 4000})
      )));
});
