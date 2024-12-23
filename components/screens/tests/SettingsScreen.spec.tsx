import React from "react";

import {describe, expect, it} from "@jest/globals";
import {render, waitFor} from "testing-library/extension";

import SettingsScreen from "../SettingsScreen";

describe("Settings screen", () => {
  it("contains all the correct elements", async () => {
    const {getByText, getAllByText} = render(<SettingsScreen />);

    expect(getByText("Settings")).toBeVisible();
    expect(getAllByText("Location")).toHaveLength(2);
    await waitFor(() => expect(getAllByText("London")).toHaveLength(2));
  });
});
