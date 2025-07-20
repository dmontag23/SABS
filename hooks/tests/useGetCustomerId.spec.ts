import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import { renderHook, waitFor } from "testing-library/extension";

import useGetCustomerId from "../useGetCustomerId";

describe("useGetCustomerId hook", () => {
  it("is still pending after receiving a customer from TodayTix and calling the mutation to store that customer", async () => {
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", "token-ttl"]
    ]);
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, { data: { id: "customer-1" } });

    const { result } = renderHook(useGetCustomerId);

    expect(await AsyncStorage.getItem("customer-id")).toBeNull();
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.isSuccess).toBe(true);
    expect(await AsyncStorage.getItem("customer-id")).toBe("customer-1");
  });
});
