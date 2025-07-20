import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "testing-library/extension";

import useGetAuthTokens from "../useGetAuthTokens";

describe("useGetAuthTokens hook", () => {
  it("returns an error from AsyncStorage", async () => {
    // setup mock error response from async storage
    (
      AsyncStorage.multiGet as jest.MockedFunction<typeof AsyncStorage.multiGet>
    ).mockRejectedValueOnce("Error with AsyncStorage multiGet");
    const { result } = renderHook(useGetAuthTokens);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({
      name: "Cannot fetch AsyncStorage token data",
      message:
        'An error occurred when trying to fetch the token from storage: "Error with AsyncStorage multiGet"'
    });
  });
});
