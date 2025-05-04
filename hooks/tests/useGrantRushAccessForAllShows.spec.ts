import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {renderHook, waitFor} from "testing-library/extension";

import useGrantRushAccessForAllShows from "../useGrantRushAccessForAllShows";

import {TodayTixShow} from "../../types/shows";

describe("useGrantRushAccessForAllShows hook", () => {
  it("grants rush access to shows after a single post", async () => {
    await AsyncStorage.setItem("customer-id", "customer-id");

    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {data: []})
      .post("/customers/customer-id/rushGrants", {showId: 1})
      .reply(201, {data: [{showId: 1, showName: "SIX the Musical"}]})
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [{showId: 1, showName: "SIX the Musical"}]
      });

    const testShows = [
      {showId: 1, showName: "SIX the Musical"} as TodayTixShow
    ];

    const {result} = renderHook(() => useGrantRushAccessForAllShows(testShows));

    await waitFor(() => expect(result.current.isGrantingAccess).toBe(false), {
      timeout: 5000
    });
    expect(result.current.rushGrants).toEqual([
      {showId: 1, showName: "SIX the Musical"}
    ]);
  });

  it("does not grant rush access to shows if no customer id exists", async () => {
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", "token-ttl"]
    ]);
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, {data: {}});

    const testShows = [
      {id: 1, showId: 1, showName: "SIX the Musical"} as TodayTixShow
    ];

    const {result} = renderHook(() => useGrantRushAccessForAllShows(testShows));

    await waitFor(() => expect(result.current.isGrantingAccess).toBe(false), {
      timeout: 5000
    });
    expect(result.current.rushGrants).toEqual([]);
  });
});
