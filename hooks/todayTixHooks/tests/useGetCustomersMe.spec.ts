import nock from "nock";
import { renderHook, waitFor } from "testing-library/extension";

import useGetCustomersMe from "../useGetCustomersMe";

describe("useGetCustomersMe hook", () => {
  it("is automatically enabled when rendered", async () => {
    const mockCustomer = { id: "customer-id" };
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, { data: mockCustomer });

    const { result } = renderHook(useGetCustomersMe);

    await waitFor(() => expect(result.current.data).toEqual(mockCustomer));
  });
});
