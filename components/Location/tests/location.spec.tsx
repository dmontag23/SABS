import React from "react";
import { Dimensions } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import {
  fireEvent,
  render,
  userEvent,
  waitFor,
  within
} from "testing-library/extension";

import LoggedInScreen from "../../screens/LoggedInScreen";

import { TodayTixFieldset } from "../../../types/shows";

describe("Locations", () => {
  it("can change the location and see the updated shows", async () => {
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, { data: { homeLocationId: 2 } })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        data: [{ id: 1, displayName: "SIX the Musical", isRushActive: true }]
      })
      .get("/locations")
      .reply(200, {
        data: [
          { id: 1, name: "New York" },
          { id: 2, name: "London" }
        ]
      })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 1
      })
      .reply(200, {
        data: [
          { id: 2, displayName: "Little Shop of Horrors", isRushActive: true }
        ]
      });

    const { getByText, getAllByText, getByRole, getByTestId, getAllByTestId } =
      render(<LoggedInScreen />);

    // check the London shows are visible
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());

    // check the settings bottom tab is visible
    const settingsTab = getByRole("button", { name: "Settings" });
    expect(settingsTab).toBeVisible();
    expect(getAllByText("Settings")).toHaveLength(2);

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(settingsTab) does not work here
    fireEvent(settingsTab, "click");
    const loadingSpinner = getAllByTestId("loading-spinner");
    expect(loadingSpinner).toHaveLength(2);
    await waitFor(() => expect(getAllByText("London")).toHaveLength(2));
    expect(loadingSpinner[0]).not.toBeOnTheScreen();
    expect(loadingSpinner[1]).not.toBeOnTheScreen();
    expect(getAllByText("Settings")).toHaveLength(3);
    expect(getAllByText("Location")).toHaveLength(2);

    // open the location bottom sheet
    await userEvent.press(getAllByText("London")[0]);

    // check that the bottom sheet elements are visible
    const bottomSheetElement = getByTestId("location-bottom-sheet");
    await waitFor(
      () =>
        expect(bottomSheetElement).toHaveAnimatedStyle({
          height: "100%",
          transform: [{ translateY: 0 }]
        }),
      { timeout: 2000 }
    );
    expect(getByText("Close")).toBeVisible();

    // check that all of the available locations are visible in the correct order
    const { getAllByRole } = within(bottomSheetElement);
    const allBottomSheetButtons = getAllByRole("button");
    expect(allBottomSheetButtons[0]).toHaveTextContent("Close");
    ["London", "New York"].forEach((location, i) => {
      expect(allBottomSheetButtons[i + 1]).toBeVisible();
      expect(allBottomSheetButtons[i + 1]).toHaveTextContent(location, {
        exact: false
      });
    });

    // change the location and check the bottom sheet is closed
    await userEvent.press(getByText("New York"));
    await waitFor(
      () =>
        expect(bottomSheetElement).toHaveAnimatedStyle({
          transform: [{ translateY: Dimensions.get("window").height }]
        }),
      { timeout: 2000 }
    );
    expect(getAllByText("New York")).toHaveLength(2);

    // check the rush bottom tab is visible
    const rushTab = getByRole("button", { name: "Rush Shows" });
    expect(rushTab).toBeVisible();

    // navigate to the settings tab
    // TODO: Investigate why userEvent.press(rushTab) does not work here
    fireEvent(rushTab, "click");
    await waitFor(() =>
      expect(getByText("Little Shop of Horrors")).toBeVisible()
    );
  });
});
