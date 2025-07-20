import React from "react";
import { Linking } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import nock from "nock";
import {
  fireEvent,
  render,
  userEvent,
  waitFor
} from "testing-library/extension";

import HoldConfirmationBottomSheet from "../HoldConfirmationBottomSheet";

import ShowDetailsScreen from "../../ShowDetails/ShowDetailsScreen";
import LoggedInBottomTabNavigator from "../../screens/LoggedInBottomTabNavigator";

import HoldContext from "../../../store/hold-context";
import { hadestownLightThemeColors } from "../../../themes";
import { TodayTixHoldErrorCode, TodayTixHoldType } from "../../../types/holds";
import { RushShowStackParamList } from "../../../types/navigation";
import { TodayTixFieldset, TodayTixShow } from "../../../types/shows";
import { TodayTixShowtime } from "../../../types/showtimes";

describe("HoldConfirmationBottomSheet component", () => {
  describe("when displaying a scheduled hold", () => {
    it("can schedule a hold, see all the correct elements, and cancel the hold", async () => {
      await AsyncStorage.setItem("customer-id", "customer-id");
      const Stack = createStackNavigator<RushShowStackParamList>();

      const ticketAvailabilityTime = new Date().getTime() / 1000 + 120;

      const { getByText, getByLabelText } = render(
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="ShowDetails"
              component={ShowDetailsScreen}
              initialParams={{
                show: { displayName: "Guys & Dolls" } as TodayTixShow,
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
          <HoldConfirmationBottomSheet />
        </>
      );

      // schedule a hold
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      const timeButton = getByText("19:00");
      await userEvent.press(timeButton);
      expect(timeButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      });
      const ticketNumberButton = getByText("1");
      await userEvent.press(ticketNumberButton);
      expect(ticketNumberButton).toHaveStyle({
        color: hadestownLightThemeColors.onPrimary
      });
      await waitFor(() =>
        expect(
          getByText("Attempting to get 1 ticket for Guys & Dolls in 00:01:58")
        ).toBeVisible()
      );
      const headerText = getByText(
        "Attempting to get 1 ticket for Guys & Dolls in 00:01:58"
      );
      const cancelButton = getByText("Cancel");
      expect(cancelButton).toBeVisible();

      // cancel the scheduled hold
      await userEvent.press(cancelButton);
      expect(headerText).not.toBeOnTheScreen();
      expect(cancelButton).not.toBeOnTheScreen();
      expect(timeButton).toHaveStyle({
        color: hadestownLightThemeColors.primary
      });
      expect(ticketNumberButton).not.toBeOnTheScreen();
    });
  });

  describe("when fetching tickets", () => {
    it("contains all the correct elements", async () => {
      await AsyncStorage.setItem("customer-id", "customer-id");
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .post("/holds", {
          customer: "customer-id",
          showtime: 1,
          numTickets: 2,
          holdType: TodayTixHoldType.Rush
        })
        .reply(201);

      const Stack = createStackNavigator<RushShowStackParamList>();

      const { getByText, getByLabelText, getByTestId } = render(
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="ShowDetails"
              component={ShowDetailsScreen}
              initialParams={{
                show: { displayName: "Guys & Dolls" } as TodayTixShow,
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

      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:00"));
      await userEvent.press(getByText("2"));
      expect(getByText("Fetching 2 tickets to Guys & Dolls")).toBeVisible();
      expect(getByTestId("loading-spinner")).toBeVisible();
    });
  });

  describe("when displaying a hold error", () => {
    it("contains all the correct elements and can retry placing hold", async () => {
      await AsyncStorage.setItem("customer-id", "customer-id");
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .post("/holds", {
          customer: "customer-id",
          showtime: 1,
          numTickets: 2,
          holdType: TodayTixHoldType.Rush
        })
        .reply(401, {
          code: 401,
          error: TodayTixHoldErrorCode.UNAUTHENTICATED,
          title: "Error"
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
          data: [
            { numSeats: 2, showtime: { show: { displayName: "Guys & Dolls" } } }
          ]
        });

      const Stack = createStackNavigator<RushShowStackParamList>();

      const { getByText, getByLabelText } = render(
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="ShowDetails"
              component={ShowDetailsScreen}
              initialParams={{
                show: { displayName: "Guys & Dolls" } as TodayTixShow,
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

      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:00"));
      await userEvent.press(getByText("2"));
      await waitFor(() =>
        expect(getByText("Error getting tickets to Guys & Dolls")).toBeVisible()
      );
      expect(getByText(TodayTixHoldErrorCode.UNAUTHENTICATED)).toBeVisible();
      const retryButton = getByText("Retry");
      expect(retryButton).toBeVisible();
      await userEvent.press(retryButton);
      await waitFor(() =>
        expect(
          getByText("You've won 2 tickets to Guys & Dolls 🎉")
        ).toBeVisible()
      );
    });

    it("shows the correct error text when shadow blocked", async () => {
      await AsyncStorage.setItem("customer-id", "customer-id");
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .post("/holds", {
          customer: "customer-id",
          showtime: 1,
          numTickets: 2,
          holdType: TodayTixHoldType.Rush
        })
        .reply(409, {
          code: 409,
          error: TodayTixHoldErrorCode.SEATS_TAKEN,
          context: [
            "Unfortunately, those tickets have just been added to another user's cart."
          ],
          title: "All seats are being held",
          message:
            "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
        });

      const Stack = createStackNavigator<RushShowStackParamList>();

      const { getByText, getByLabelText } = render(
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="ShowDetails"
              component={ShowDetailsScreen}
              initialParams={{
                show: {} as TodayTixShow,
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

      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      await userEvent.press(getByText("19:00"));
      await userEvent.press(getByText("2"));
      await waitFor(() =>
        expect(getByText("You've been shadow blocked!")).toBeVisible()
      );
      expect(
        getByText(
          "TodayTix is putting you at the back of the queue. You can try to get tickets again, but you will only get them if someone else does not ask for them too. Please create a new TodayTix account to ensure you get tickets."
        )
      ).toBeVisible();
    });

    it("does not retry hold if no customer id, show, or showtime are available", async () => {
      const scheduleHold = jest.fn();
      const { getByText } = render(
        /* There is no way to access the retry function without a customer id via user interaction, and hence
          a dummy context needs to be provided. */
        <HoldContext.Provider
          value={{
            isCreatingHold: false,
            createHoldError: { error: TodayTixHoldErrorCode.CONFLICT },
            isHoldScheduled: false,
            scheduleHold,
            cancelHold: () => {}
          }}
        >
          <HoldConfirmationBottomSheet />
        </HoldContext.Provider>
      );

      expect(getByText("Retry")).toBeVisible();
      const retryButton = getByText("Retry");
      await userEvent.press(retryButton);
      expect(scheduleHold).not.toBeCalled();
    });
  });

  describe("when displaying a hold", () => {
    it("contains all the correct elements", async () => {
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .get("/holds")
        .reply(200, {
          data: [
            {
              configurableTexts: { amountDisplayForWeb: "£25.00" },
              numSeats: 2,
              seatsInfo: { row: "D", seats: ["5", "6"], sectionName: "Stalls" },
              showtime: { show: { displayName: "SIX the Musical" } }
            }
          ]
        });

      const { getByText } = render(<HoldConfirmationBottomSheet />);

      await waitFor(
        () =>
          expect(
            getByText("You've won 2 tickets to SIX the Musical 🎉")
          ).toBeVisible(),
        { timeout: 3000 }
      );

      // check the bottom sheet contains all of the page elements
      expect(getByText("Seats")).toBeVisible();
      expect(getByText("Stalls")).toBeVisible();
      expect(getByText("Row D, Seats 5 and 6")).toBeVisible();
      expect(getByText("Order Total")).toBeVisible();
      expect(getByText("£25.00")).toBeVisible();
      expect(getByText("Purchase on TodayTix")).toBeVisible();
      expect(getByText("Release tickets")).toBeVisible();
    });

    it("can purchase tickets on the TodayTix app", async () => {
      // mock the deep linking mechanism in order to test it
      jest.mock("react-native/Libraries/Linking/Linking");
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .get("/holds")
        .reply(200, {
          data: [
            {
              numSeats: 2,
              showtime: { show: { displayName: "SIX the Musical" } }
            }
          ]
        });

      const { getByText } = render(<HoldConfirmationBottomSheet />);

      await waitFor(
        () =>
          expect(
            getByText("You've won 2 tickets to SIX the Musical 🎉")
          ).toBeVisible(),
        { timeout: 3000 }
      );

      // check navigation to the TodayTix app to purchase tickets is possible
      await userEvent.press(getByText("Purchase on TodayTix"));
      expect(Linking.openURL).toBeCalled();
      expect(Linking.openURL).toBeCalledWith(process.env.TODAY_TIX_APP_URL);
    });

    it("can release tickets", async () => {
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
        .reply(201)
        .get("/holds")
        .reply(200, {
          data: [
            {
              id: 1,
              numSeats: 2,
              showtime: { show: { displayName: "SIX the Musical" } }
            }
          ]
        })
        .delete("/holds/1")
        .reply(200)
        .get("/holds")
        .reply(200, { data: [] });

      const Stack = createStackNavigator<RushShowStackParamList>();
      const { getByText, queryByText, getByLabelText } = render(
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="ShowDetails"
              component={ShowDetailsScreen}
              initialParams={{
                show: {} as TodayTixShow,
                showtimes: [
                  {
                    id: 1,
                    localTime: "19:00",
                    rushTickets: { minTickets: 1, maxTickets: 2 }
                  } as TodayTixShowtime
                ]
              }}
            />
          </Stack.Navigator>
          <HoldConfirmationBottomSheet />
        </>
      );

      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      const timeButton = getByText("19:00");
      await userEvent.press(timeButton);
      await userEvent.press(getByText("2"));
      const headerText = "You've won 2 tickets to SIX the Musical 🎉";
      await waitFor(() => expect(getByText(headerText)).toBeVisible());
      expect(timeButton).toHaveStyle({
        color: hadestownLightThemeColors.onSurfaceDisabled
      });

      // release the tickets
      await userEvent.press(getByText("Release tickets"));
      await waitFor(() => expect(queryByText(headerText)).toBeNull());
      expect(timeButton).toHaveStyle({
        color: hadestownLightThemeColors.primary
      });
      expect(queryByText("Number of Tickets")).toBeNull();
    }, 10000);
  });

  it("cancels a hold when selecting a new showtime", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 1,
        holdType: TodayTixHoldType.Rush
      })
      .reply(401, {
        code: 401,
        error: TodayTixHoldErrorCode.UNAUTHENTICATED,
        message:
          "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const { getByText, getByLabelText, queryByText } = render(
      <>
        <Stack.Navigator>
          <Stack.Screen
            name="ShowDetails"
            component={ShowDetailsScreen}
            initialParams={{
              show: {
                id: 1,
                displayName: "SIX the Musical"
              } as TodayTixShow,
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

    // see an error when clicking on the first showtime
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    await userEvent.press(getByText("1"));
    const errorText = `Error getting tickets to SIX the Musical`;
    await waitFor(() => expect(getByText(errorText)).toBeVisible());

    // clear the error by clicking on a showtime
    await userEvent.press(getByText("19:00"));
    expect(queryByText(errorText)).toBeNull();
  });

  it("persists bottom sheet across screens", async () => {
    await AsyncStorage.setItem("customer-id", "customer-id");
    await AsyncStorage.setItem("location-id", "2");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/holds")
      .reply(200, {
        data: [
          {
            numSeats: 2,
            showtime: { show: { displayName: "SIX the Musical" } }
          }
        ]
      })
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
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, { data: [{ id: 1 }] });

    const { getByText, getByLabelText } = render(
      <LoggedInBottomTabNavigator />
    );

    const headerText = "You've won 2 tickets to SIX the Musical 🎉";
    await waitFor(() => expect(getByText(headerText)).toBeVisible());
    const showCardText = "SIX the Musical";
    await waitFor(() => expect(getByText(showCardText)).toBeVisible());

    // navigate between screens
    await userEvent.press(getByText(showCardText));
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    expect(getByText(headerText)).toBeVisible();
    await waitFor(() => expect(getByText("Select a Time")).toBeVisible());
    expect(getByText(headerText)).toBeVisible();
  });
});
