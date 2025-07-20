import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import nock from "nock";
import { render, waitFor } from "testing-library/extension";

import RootNavigator from "../RootNavigator";

import { TodayTixFieldset } from "../../../types/shows";

describe("The root navigator", () => {
  it("renders the splash screen when loading the access tokens", async () => {
    // setup
    const scope = nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const { getByLabelText } = render(<RootNavigator />);
    // wait for the above call to complete so the access tokens are the only thing loading
    await waitFor(() => scope.isDone());

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the splash screen when loading the shows", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .delay(5000)
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const { getByLabelText } = render(<RootNavigator />);

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the splash screen when loading the showtimes", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        code: 200,
        data: [
          {
            id: 1,
            displayName: "SIX the Musical",
            isRushActive: true
          }
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .delay(5000)
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const { getByLabelText } = render(<RootNavigator />);

    // assert
    expect(getByLabelText("TodayTix logo")).toBeVisible();
  });

  it("renders the initial auth screen without an auth token", async () => {
    // setup
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        code: 200,
        data: []
      });

    // render
    const { getByText } = render(<RootNavigator />);

    // assert
    await waitFor(() => expect(getByText("Sign into TodayTix")).toBeVisible());
  });

  const dataSet = [
    { tokenKey: "access-token", tokenValue: "access-token" },
    { tokenKey: "refresh-token", tokenValue: "refresh-token" }
  ];
  it.each(dataSet)(
    "renders the initial auth screen with just a $tokenKey",
    async ({ tokenKey, tokenValue }) => {
      // setup
      await AsyncStorage.setItem(tokenKey, tokenValue);
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .get("/shows")
        .query({
          areAccessProgramsActive: 1,
          fieldset: TodayTixFieldset.Summary,
          limit: 10000,
          location: 2
        })
        .reply(200, {
          code: 200,
          data: []
        });

      // render
      const { getByText } = render(<RootNavigator />);

      // assert
      await waitFor(
        () => expect(getByText("Sign into TodayTix")).toBeVisible(),
        { timeout: 3000 }
      );
    }
  );

  it("renders the home screen with an access and refresh token", async () => {
    // setup
    await AsyncStorage.setItem("access-token", "access-token");
    await AsyncStorage.setItem("refresh-token", "refresh-token");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, { data: [] });

    // render
    const { getAllByText } = render(<RootNavigator />);

    // assert
    await waitFor(() => expect(getAllByText("Rush Shows")).toHaveLength(2));
  });
});
