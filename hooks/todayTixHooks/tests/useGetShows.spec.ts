import nock from "nock";
import {renderHook, waitFor} from "testing-library/extension";

import useGetShows from "../useGetShows";

describe("useGetShows hook", () => {
  it("returns shows without any query params", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .reply(200, {
        data: [{id: "Test show"}]
      });

    const {result} = renderHook(useGetShows);

    await waitFor(() => expect(result.current.data?.[0].id).toBe("Test show"));
  });

  it("handles an offset", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        offset: "10"
      })
      .reply(200, {
        data: [{id: "Test show"}]
      });

    const {result} = renderHook(() =>
      useGetShows({requestParams: {offset: 10}})
    );

    await waitFor(() => expect(result.current.data?.[0].id).toBe("Test show"), {
      timeout: 2000
    });
  });
});
