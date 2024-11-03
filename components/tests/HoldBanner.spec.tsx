import React from "react";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createStackNavigator} from "@react-navigation/stack";
import nock from "nock";
import {fireEvent, render, userEvent, waitFor} from "testing-library/extension";

import ShowDetailsScreen from "../ShowDetails/ShowDetailsScreen";
import HoldConfirmationBottomSheet from "../screens/HoldConfirmationBottomSheet";
import RushShowListScreen from "../screens/RushShowListScreen";

import HoldContext from "../../store/hold-context";
import {hadestownLightThemeColors} from "../../themes";
import {TodayTixHoldErrorCode, TodayTixHoldType} from "../../types/holds";
import {RushShowStackParamList} from "../../types/navigation";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow
} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Hold banner", () => {
  it("displays correctly on both rush show list and show details screens", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    const ticketAvailabilityTime = new Date(2021, 4, 23, 10).getTime() / 1000;
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {data: [{showId: 1, showName: "SIX the Musical"}]})
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
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 1,
            localTime: "19:00",
            rushTickets: {
              minTickets: 1,
              maxTickets: 2,
              availableAfterEpoch: ticketAvailabilityTime
            }
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText, getByTestId} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
        <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
      </Stack.Navigator>
    );

    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    /* check that the banner is rendered on the rush show list page
    but not visible */
    expect(getByTestId("rushBanner")).not.toBeVisible();

    await userEvent.press(getByText("SIX the Musical"));
    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));

    // check the banner appears on the show details page
    await waitFor(() =>
      expect(
        getByText("Attempting to get 2 tickets for SIX the Musical in 09:59:58")
      ).toBeVisible()
    );
  });

  it("can cancel a scheduled hold", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");

    const Stack = createStackNavigator<RushShowStackParamList>();
    const ticketAvailabilityTime =
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000;
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen
          name="ShowDetails"
          component={ShowDetailsScreen}
          initialParams={{
            show: {id: 1, displayName: "Hamilton"} as TodayTixShow,
            showtimes: [
              {
                id: 1,
                localTime: "19:00",
                rushTickets: {
                  minTickets: 1,
                  maxTickets: 2,
                  availableAfterEpoch: ticketAvailabilityTime
                }
              } as TodayTixShowtime
            ]
          }}
        />
      </Stack.Navigator>
    );

    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    expect(getByText("Hamilton")).toBeVisible();
    const showButton = getByText("19:00");
    await userEvent.press(showButton);
    const numTicketsButton = getByText("1");
    await userEvent.press(numTicketsButton);
    expect(showButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
    expect(numTicketsButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });

    // check the banner appears on the show details page
    await waitFor(() =>
      expect(
        getByText("Attempting to get 1 ticket for Hamilton in 00:00:03")
      ).toBeVisible()
    );
    const bannerText = getByText(
      "Attempting to get 1 ticket for Hamilton in 00:00:03"
    );
    expect(getByText("Cancel")).toBeVisible();
    await userEvent.press(getByText("Cancel"));

    // ensure the banner is no longer visible and the date and time are not selected
    expect(bannerText).not.toBeVisible();
    expect(showButton).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });
    expect(numTicketsButton).not.toBeOnTheScreen();
  });

  it("shows hold error", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/holds")
      .reply(200)
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(409, {
        error: TodayTixHoldErrorCode.UNAUTHENTICATED,
        message:
          "Sorry, something went wrong. Please try again and contact TodayTix Support if the issue persists."
      })
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(409, {
        error: TodayTixHoldErrorCode.UNAUTHENTICATED
      })
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201)
      .get("/holds")
      .reply(200, {
        data: [{numSeats: 2, showtime: {show: {displayName: "Hamilton"}}}]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText, getByTestId} = render(
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="ShowDetails"
            component={ShowDetailsScreen}
            initialParams={{
              show: {id: 1, displayName: "Hamilton"} as TodayTixShow,
              showtimes: [
                {
                  id: 1,
                  localTime: "19:00",
                  rushTickets: {
                    minTickets: 1,
                    maxTickets: 2
                  }
                } as TodayTixShowtime
              ]
            }}
          />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
    );

    // load the header image
    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    expect(getByText("Hamilton")).toBeVisible();
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("2"));

    // check the banner appears on the show details page with an error message
    await waitFor(() =>
      expect(getByText("Trying to get 2 tickets to Hamilton")).toBeVisible()
    );
    expect(getByTestId("loadingSpinner")).toBeVisible();
    await waitFor(() =>
      expect(
        getByText(
          "Oh no! There was an error getting tickets to Hamilton:\nSorry, something went wrong. Please try again and contact TodayTix Support if the issue persists."
        )
      ).toBeVisible()
    );
    expect(getByText("Retry")).toBeVisible();
    await userEvent.press(getByText("Retry"));
    await waitFor(() =>
      expect(
        getByText(
          `Oh no! There was an error getting tickets to Hamilton:\n${TodayTixHoldErrorCode.UNAUTHENTICATED}`
        )
      ).toBeVisible()
    );
    await userEvent.press(getByText("Retry"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
  });

  it("does not retry hold if no customer id, show, or showtime are available", async () => {
    const scheduleHold = jest.fn();
    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
      /* There is no way to access the retry function without a customer id via user interaction, and hence
      a dummy context needs to be provided. */
      <HoldContext.Provider
        value={{
          isCreatingHold: false,
          createHoldError: {error: TodayTixHoldErrorCode.CONFLICT},
          isHoldScheduled: false,
          scheduleHold,
          cancelHold: () => {}
        }}>
        <Stack.Navigator>
          <Stack.Screen
            name="ShowDetails"
            component={ShowDetailsScreen}
            initialParams={{
              show: {} as TodayTixShow,
              showtimes: []
            }}
          />
        </Stack.Navigator>
      </HoldContext.Provider>
    );

    await waitFor(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    const retryButton = getByText("Retry");
    expect(retryButton).toBeVisible();
    await userEvent.press(retryButton);
    expect(scheduleHold).not.toBeCalled();
  });
});
