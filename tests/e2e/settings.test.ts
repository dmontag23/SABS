import {beforeEach, describe, it} from "@jest/globals";
import {expect} from "detox";

import {login} from "./utils/utils";

describe("Rush shows", () => {
  beforeEach(login);

  it("can change the location", async () => {
    const settingsTab = element(by.text("Settings")).atIndex(0);
    await expect(settingsTab).toBeVisible();

    // navigate to the settings tab
    await settingsTab.tap();
    const locationText = element(by.text("Location")).atIndex(0);
    await expect(locationText).toBeVisible();
    await expect(element(by.text("London")).atIndex(0)).toBeVisible();

    // open the location bottom sheet and check all locations are visible
    await locationText.tap();
    await expect(locationText).toBeVisible();
    const closeButton = element(by.text("Close"));
    await expect(closeButton).toBeVisible();

    const locations = [
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
    ];
    for (const location of locations) {
      if (location === "London") {
        await expect(element(by.text(location)).atIndex(1)).toBeVisible();
        continue;
      }
      await expect(element(by.text(location))).toBeVisible();
    }

    // close and reopen the location bottom sheet
    await closeButton.tap();
    await expect(closeButton).not.toBeVisible();

    // change the location to New York
    await locationText.tap();
    await element(by.text("New York")).tap();
    await expect(closeButton).not.toBeVisible();

    // ensure the location has changed
    await expect(element(by.text("New York")).atIndex(0)).toBeVisible();
    await element(by.text("Rush Shows")).atIndex(0).tap();
    await expect(element(by.text("Little Shop of Horrors"))).toBeVisible();
  });
});
