import React from "react";
import {Linking} from "react-native";

import {describe, expect, it, jest} from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createStackNavigator} from "@react-navigation/stack";
import nock from "nock";
import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor
} from "testing-library/extension";

import ShowDetailsScreen from "../ShowDetails/ShowDetailsScreen";
import HoldConfirmationBottomSheet from "../screens/HoldConfirmationBottomSheet";
import RushShowListScreen from "../screens/RushShowListScreen";

import {systemTime} from "../../tests/integration/setup";
import {hadestownLightThemeColors} from "../../themes";
import {TodayTixHoldErrorCode, TodayTixHoldType} from "../../types/holds";
import {RushShowStackParamList} from "../../types/navigation";
import {
  TodayTixFieldset,
  TodayTixLocation,
  TodayTixShow
} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

describe("Holds", () => {
  it("can be placed automatically when selecting a show time if rush is open", async () => {
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
      .reply(201)
      .get("/holds")
      .reply(200, {
        data: [
          {
            numSeats: 2,
            showtime: {show: {displayName: "Hamilton"}}
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
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
                  rushTickets: {minTickets: 1, maxTickets: 2}
                } as TodayTixShowtime
              ]
            }}
          />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
    );

    // load the header image
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
  });

  it("schedules a hold if rush is closed", async () => {
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
      .reply(201)
      .get("/holds")
      .reply(200, {
        data: [
          {
            numSeats: 2,
            showtime: {show: {displayName: "Hamilton"}}
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const ticketAvailabilityTime =
      new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000;
    const {getByText, queryByText, getByLabelText} = render(
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

    // load the header image
    act(() => fireEvent(getByLabelText("Header image"), "onLoadEnd"));
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    /* the - 1000 below is to ensure that requests are made to the holds endpoint
    1 second before rush tickets open */
    const timeToTicketAvailability =
      ticketAvailabilityTime * 1000 - new Date().getTime();
    const wonTicketsText = "You've won 2 tickets to Hamilton 🎉";
    expect(queryByText(wonTicketsText)).toBeNull();
    act(() => jest.advanceTimersByTime(timeToTicketAvailability - 1000));
    await waitFor(() => expect(getByText(wonTicketsText)).toBeVisible());
  });

  it("fetches a customer from the TodayTix API if one is not available before placing a hold", async () => {
    // setup
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", new Date("2024-01-01").getTime().toString()]
    ]);

    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, {data: {id: "customer-id"}})
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
            numSeats: 2,
            showtime: {show: {displayName: "Hamilton"}}
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
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
                  rushTickets: {minTickets: 1, maxTickets: 2}
                } as TodayTixShowtime
              ]
            }}
          />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
    );

    expect(await AsyncStorage.getItem("customer-id")).toBeNull();
    // load the header image
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    await waitFor(() => expect(getByText("2")).toBeVisible());
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
    expect(await AsyncStorage.getItem("customer-id")).toBe("customer-id");
  });

  it("attempts to place a hold 60 times if all seats are taken before succeeding on the final attempt", async () => {
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
      .times(58)
      .reply(409, {
        code: 409,
        error: TodayTixHoldErrorCode.SEATS_TAKEN,
        context: [
          "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
        ],
        title: "All seats are being held",
        message:
          "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
      })
      .post("/holds", {
        customer: "customer-id",
        showtime: 1,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(409, {
        code: 409,
        error: TodayTixHoldErrorCode.CONFLICT,
        context: ["Sorry, rush ticket sales for this showtime are not open."],
        title: "Sales closed",
        message:
          "Sorry, sales have just closed for this performance. Please check back later."
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
    const {getByText, getByLabelText} = render(
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
                  rushTickets: {minTickets: 1, maxTickets: 2}
                } as TodayTixShowtime
              ]
            }}
          />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
    );

    // load the header image
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(
      () =>
        expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible(),
      {timeout: 20000}
    );
  });

  it("cancels a hold for a show that is yet not open and gets tickets for a new show", async () => {
    // setup
    await AsyncStorage.setItem("customer-id", "customer-id");
    const show1TicketAvailabilityDate = new Date(2021, 4, 23, 0, 1);
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [
          {showId: 1, showName: "SIX the Musical"},
          {showId: 2, showName: "Hamilton"}
        ]
      })
      .get("/holds")
      .reply(200)
      .post("/holds", {
        customer: "customer-id",
        showtime: 2,
        numTickets: 2,
        holdType: TodayTixHoldType.Rush
      })
      .reply(201)
      .get("/holds")
      .reply(200, {
        data: [{numSeats: 2, showtime: {show: {displayName: "Hamilton"}}}]
      })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: TodayTixLocation.London
      })
      .reply(200, {
        data: [
          {
            id: 1,
            displayName: "SIX the Musical",
            isRushActive: true,
            showId: 1
          },
          {id: 2, displayName: "Hamilton", isRushActive: true, showId: 2}
        ]
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
              availableAfter: show1TicketAvailabilityDate.toISOString(),
              availableAfterEpoch: show1TicketAvailabilityDate.getTime() / 1000,
              availableUntil: show1TicketAvailabilityDate.toISOString()
            }
          }
        ]
      })
      .get("/shows/2/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 2,
            localTime: "19:30",
            rushTickets: {
              minTickets: 1,
              maxTickets: 2,
              availableAfter: systemTime.toISOString(),
              availableAfterEpoch: systemTime.getTime() / 1000,
              availableUntil: systemTime.toISOString()
            }
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
      <>
        <Stack.Navigator>
          <Stack.Screen name="RushShowList" component={RushShowListScreen} />
          <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
    );

    // schedule a hold for the first show that is closed
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    await userEvent.press(getByText("SIX the Musical"));
    expect(getByLabelText("Header image")).toBeVisible();
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));

    // get tickets for a second show that is already open
    await userEvent.press(getByLabelText("Back button"));
    /* The timers are advanced by 1 second here because the slide transition from the screen
    details page to the rush show list page takes about 1 second, and if you click the rush 
    show card when it is visible but before the transition has finished, nothing will happen.
    This can be reproduced manually on the simulator. */
    act(() => jest.advanceTimersByTime(1000));
    await userEvent.press(getByText("Hamilton"));
    expect(getByLabelText("Header image")).toBeVisible();
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:30"));
    expect(getByText("2")).toBeVisible();
    await userEvent.press(getByText("2"));
    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
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
    const {getByText, getByLabelText, queryByText} = render(
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
    );

    // see an error when clicking on the first showtime
    fireEvent(getByLabelText("Header image"), "onLoadEnd");
    await userEvent.press(getByText("19:00"));
    expect(getByText("1")).toBeVisible();
    await userEvent.press(getByText("1"));
    const errorText = `Oh no! There was an error getting tickets to SIX the Musical:\nSorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists.`;
    await waitFor(() => expect(getByText(errorText)).toBeVisible());

    // clear the error by clicking on the showtime
    await userEvent.press(getByText("19:00"));
    expect(queryByText(errorText)).toBeNull();
  });

  describe("Hold confirmation bottom sheet", () => {
    it("contains all the correct elements", async () => {
      nock(
        `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
      )
        .get("/holds")
        .reply(200, {
          data: [
            {
              configurableTexts: {amountDisplayForWeb: "£25.00"},
              numSeats: 2,
              seatsInfo: {row: "D", seats: ["5", "6"], sectionName: "Stalls"},
              showtime: {show: {displayName: "SIX the Musical"}}
            }
          ]
        });

      const {getByText} = render(<HoldConfirmationBottomSheet />);

      await waitFor(
        () =>
          expect(
            getByText("You've won 2 tickets to SIX the Musical 🎉")
          ).toBeVisible(),
        {timeout: 3000}
      );

      // check the bottom sheet contains all of the page elements
      expect(getByText("Seats")).toBeVisible();
      expect(getByText("Stalls")).toBeVisible();
      expect(getByText("Row D, Seats 5 and 6")).toBeVisible();
      expect(getByText("Order Total")).toBeVisible();
      expect(getByText("£25.00")).toBeVisible();
      expect(
        getByText(
          "IMPORTANT: Hard-close the TodayTix app before pressing the Purchase button!"
        )
      ).toBeVisible();
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
            {numSeats: 2, showtime: {show: {displayName: "SIX the Musical"}}}
          ]
        });

      const {getByText} = render(<HoldConfirmationBottomSheet />);

      await waitFor(
        () =>
          expect(
            getByText("You've won 2 tickets to SIX the Musical 🎉")
          ).toBeVisible(),
        {timeout: 3000}
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
              showtime: {show: {displayName: "SIX the Musical"}}
            }
          ]
        })
        .delete("/holds/1")
        .reply(200)
        .get("/holds")
        .reply(200, {data: []});

      const Stack = createStackNavigator<RushShowStackParamList>();
      const {getByText, queryByText, getByLabelText} = render(
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
                    rushTickets: {minTickets: 1, maxTickets: 2}
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

  it("persists modal across screens", async () => {
    await AsyncStorage.setItem("customer-id", "customer-id");

    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/holds")
      .reply(200, {
        data: [
          {numSeats: 2, showtime: {show: {displayName: "SIX the Musical"}}}
        ]
      })
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
      .reply(200, {data: [{id: 1}]});

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
      <>
        <Stack.Navigator>
          <Stack.Screen name="RushShowList" component={RushShowListScreen} />
          <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
        </Stack.Navigator>
        <HoldConfirmationBottomSheet />
      </>
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
