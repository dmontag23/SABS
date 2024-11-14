import React from "react";

import {describe, expect, it} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {fireEvent, render, userEvent, waitFor} from "testing-library/extension";

import LoggedInBottomTabNavigator from "../../screens/LoggedInBottomTabNavigator";

import {TodayTixFieldset, TodayTixLocation} from "../../../types/shows";

describe("Locations", () => {
  it("can change the location and see the updated shows", async () => {
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        data: [{id: 1, displayName: "SIX the Musical", isRushActive: true}]
      })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.NewYork
      })
      .reply(200, {
        data: [
          {id: 2, displayName: "Little Shop of Horrors", isRushActive: true}
        ]
      });

    const {getByText, getAllByText, getByRole} = render(
      <LoggedInBottomTabNavigator />
    );

    // check the London shows are visible
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());

    // check the settings bottom tab is visible
    const settingsTab = getByRole("button", {name: "Settings"});
    expect(settingsTab).toBeVisible();
    expect(getAllByText("Settings")).toHaveLength(2);

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(settingsTab) does not work here
    fireEvent(settingsTab, "click");
    await waitFor(() => expect(getAllByText("Settings")).toHaveLength(3));
    await waitFor(() => expect(getAllByText("London")[0]).toBeVisible());

    // open the location bottom sheet
    /* note that gorhom/react-native-bottom-sheet package contains a bug; its mock
    does not toggle the bottom sheet modal visibility, and so the test
    sill passes even if the next line is commented out */
    await userEvent.press(getAllByText("London")[0]);
    // check that the bottom sheet header elements are visible
    expect(getAllByText("Location")).toHaveLength(2);
    expect(getByText("Close")).toBeVisible();
    // check that all of the available locations are visible
    [
      "Adelaide",
      "Brisbane",
      "Chicago",
      "London",
      "Los Angeles And Orange County",
      "Melbourne",
      "New York",
      "Perth",
      "San Francisco",
      "Sydney",
      "Washington D.C.",
      "Other Cities"
    ].forEach(location => {
      expect(getByRole("button", {name: location})).toBeVisible();
    });

    // change the location
    await userEvent.press(getByText("New York"));
    await waitFor(() => expect(getAllByText("New York")).toHaveLength(2));

    // check the rush bottom tab is visible
    const rushTab = getByRole("button", {name: "Rush Shows"});
    expect(rushTab).toBeVisible();

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(rushTab) does not work here
    fireEvent(rushTab, "click");
    await waitFor(() =>
      expect(getByText("Little Shop of Horrors")).toBeVisible()
    );
  });
});
