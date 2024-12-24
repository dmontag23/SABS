import React from "react";
import {Dimensions} from "react-native";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor
} from "testing-library/extension";

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

    const {getByText, getAllByText, getByRole, getByTestId} = render(
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
    expect(getAllByText("Location")).toHaveLength(2);
    expect(getAllByText("London")).toHaveLength(2);

    // open the location bottom sheet
    await userEvent.press(getAllByText("London")[0]);
    act(() => jest.advanceTimersByTime(1500));

    // check that the bottom sheet elements are visible
    const bottomSheetElement = getByTestId("location-bottom-sheet");
    expect(bottomSheetElement).toHaveAnimatedStyle({
      height: "100%",
      transform: [{translateY: 0}]
    });
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

    // change the location and check the bottom sheet is closed
    await userEvent.press(getByText("New York"));
    act(() => jest.advanceTimersByTime(1500));
    expect(getAllByText("New York")).toHaveLength(2);
    expect(bottomSheetElement).toHaveAnimatedStyle({
      transform: [{translateY: Dimensions.get("window").height}]
    });

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
