import React from "react";

import nock from "nock";
import { render, waitFor } from "testing-library/extension";

import LoggedInScreen from "../LoggedInScreen";

describe("LoggedInScreen component", () => {
  it("renders the bottom tab navigator on api error response", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .reply(401);

    const { getByRole } = render(<LoggedInScreen />);

    await waitFor(() =>
      expect(getByRole("button", { name: "Rush Shows" })).toBeVisible()
    );
  });
});
