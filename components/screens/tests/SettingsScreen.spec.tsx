import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {render, waitFor} from "testing-library/extension";

import SettingsScreen from "../SettingsScreen";

describe("Settings screen", () => {
  it("contains all the correct elements", async () => {
    await AsyncStorage.setItem("location-id", "2");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/locations")
      .reply(200, {data: [{id: 2, name: "London"}]});

    const {getByText, getAllByText} = render(<SettingsScreen />);

    expect(getByText("Settings")).toBeVisible();
    expect(getAllByText("Location")).toHaveLength(2);
    await waitFor(() => expect(getAllByText("London")).toHaveLength(2));
  });
});
