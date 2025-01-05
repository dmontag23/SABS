import React from "react";

import {beforeEach, describe, expect, it, jest} from "@jest/globals";
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

import RushShowListScreen from "../RushShowListScreen";

import ShowDetailsScreen from "../../ShowDetails/ShowDetailsScreen";

import {hadestownLightThemeColors} from "../../../themes";
import {RushShowStackParamList} from "../../../types/navigation";
import {TodayTixFieldset} from "../../../types/shows";

describe("Rush show list", () => {
  beforeEach(async () => {
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", new Date("2024-01-01").getTime().toString()],
      ["customer-id", "customer-id"],
      ["location-id", "2"]
    ]);
  });

  it("sorts shows", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [
          {showId: 1, showName: "SIX the Musical"},
          {showId: 3, showName: "Hamilton"},
          {showId: 5, showName: "Come from Away"}
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
        data: [
          {
            id: 1,
            displayName: "SIX the Musical",
            isRushActive: true,
            showId: 1
          },
          {id: 2, displayName: "Unfortunate", isRushActive: true, showId: 2},
          {id: 3, displayName: "Hamilton", isRushActive: true, showId: 3},
          {id: 4, displayName: "Hadestown", isRushActive: true, showId: 4},
          {id: 5, displayName: "Come from Away", isRushActive: true, showId: 5}
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 1,
            rushTickets: {
              quantityAvailable: 4,
              availableAfter: "2021-05-23T09:30:00.000",
              availableUntil: "2021-05-23T15:30:00.000"
            }
          }
        ]
      })
      .get("/shows/2/showtimes/with_rush_availability")
      .reply(200, {data: []})
      .get("/shows/3/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 3,
            rushTickets: {
              quantityAvailable: 3,
              availableAfter: "2021-05-23T09:30:00.000",
              availableUntil: "2021-05-23T15:30:00.000"
            }
          },
          {
            id: 4,
            rushTickets: {
              quantityAvailable: 2,
              availableAfter: "2021-05-23T09:30:00.000",
              availableUntil: "2021-05-23T15:30:00.000"
            }
          }
        ]
      })
      .get("/shows/4/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 4,
            rushTickets: {
              quantityAvailable: 10,
              availableAfter: "2021-05-23T09:30:00.000",
              availableUntil: "2021-05-23T15:30:00.000"
            }
          }
        ]
      })
      .get("/shows/5/showtimes/with_rush_availability")
      .reply(200, {data: []});

    // render
    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getAllByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
      </Stack.Navigator>
    );

    // assert
    await waitFor(() => expect(getAllByLabelText("Show card")).toHaveLength(5));
    const allShows = getAllByLabelText("Show card");
    [
      "Hamilton",
      "SIX the Musical",
      "Hadestown",
      "Unfortunate",
      "Come from Away"
    ].map((showName, i) => {
      expect(allShows[i]).toBeVisible();
      expect(allShows[i]).toContainElement(getByText(showName));
    });
  });

  it("navigates to the show details screen and back", async () => {
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
        location: 2
      })
      .reply(200, {
        data: [
          {id: 1, displayName: "SIX the Musical", isRushActive: true, showId: 1}
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 1,
            rushTickets: {
              quantityAvailable: 4,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      });

    // render
    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByTestId, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
        <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
      </Stack.Navigator>
    );

    // assert
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    const showCard = getByText("SIX the Musical");
    expect(showCard).toBeVisible();
    expect(getByText("10:00 to 15:30")).toBeVisible();

    // navigate to the show details screen
    await userEvent.press(showCard);

    // load the header image
    const loadingSpinner = getByTestId("loading-spinner");
    expect(loadingSpinner).toBeVisible();
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(loadingSpinner).not.toBeOnTheScreen();
    });
    const backButton = getByLabelText("Back button");
    expect(backButton).toBeVisible();

    // go back to the rush show list
    await userEvent.press(backButton);

    expect(getByText("10:00 to 15:30")).toBeVisible();
  });

  it("maintains selected show state when navigating to other shows and back", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {data: []})
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        data: [
          {id: 1, displayName: "SIX the Musical", isRushActive: true},
          {
            id: 2,
            displayName: "Hamilton",
            isRushActive: true,
            images: {
              productMedia: {
                appHeroImage: {file: {url: "test-url-for-show-card"}},
                headerImage: {file: {url: "test-url-for-header-photo"}}
              }
            }
          }
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
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableAfterEpoch: 1621764000,
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      })
      .get("/shows/2/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 2,
            localTime: "14:00",
            rushTickets: {
              minTickets: 1,
              maxTickets: 2,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      });

    // render
    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
        <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
      </Stack.Navigator>
    );

    // navigate to the show details screen
    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    await userEvent.press(getByText("SIX the Musical"));

    // load the header image
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });

    // select two tickets for the evening show
    const eveningShowtimeButton = getByText("19:00");
    await userEvent.press(eveningShowtimeButton);
    expect(eveningShowtimeButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
    const ticketNumberButton = getByText("2");
    await userEvent.press(ticketNumberButton);
    expect(ticketNumberButton).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });

    // navigate to a different show
    await userEvent.press(getByLabelText("Back button"));
    /* The timers are advanced by 1 second here because the slide transition from the screen
    details page to the rush show list page takes about 1 second, and if you click the rush 
    show card when it is visible but before the transition has finished, nothing will happen.
    This can be reproduced manually on the simulator. */
    act(() => jest.advanceTimersByTime(1000));
    await userEvent.press(getByText("Hamilton"));

    // check that the show button is de-selected
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });
    expect(getByText("14:00")).toHaveStyle({
      color: hadestownLightThemeColors.primary
    });

    // navigate back to the first show
    await userEvent.press(getByLabelText("Back button"));
    /* The timers are advanced by 1 second here because the slide transition from the screen
    details page to the rush show list page takes about 1 second, and if you click the rush 
    show card when it is visible but before the transition has finished, nothing will happen.
    This can be reproduced manually on the simulator. */
    act(() => jest.advanceTimersByTime(1000));
    await userEvent.press(getByText("SIX the Musical"));

    // check that the show and tickets are still selected
    await waitFor(() => {
      fireEvent(getByLabelText("Header image"), "onLoadEnd");
      expect(getByLabelText("Back button")).toBeVisible();
    });
    expect(getByText("19:00")).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
    expect(getByText("2")).toHaveStyle({
      color: hadestownLightThemeColors.onPrimary
    });
  }, 10000);

  it("shows a loading indicator if granting rush access to shows", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .delay(5000)
      .reply(200, {data: []})
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        data: [
          {id: 1, displayName: "SIX the Musical", isRushActive: true, showId: 1}
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByTestId} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
      </Stack.Navigator>
    );

    expect(getByTestId("loading-spinner")).toBeVisible();
  });

  it("shows not unlocked text for shows that have not been unlocked for rush", async () => {
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [{showId: 1, showName: "SIX the Musical"}]
      })
      .post("/customers/customer-id/rushGrants", {showId: 2})
      .reply(401, {
        code: 401,
        error: "UnauthenticatedException",
        title: "Error",
        message:
          "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
      })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
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
            rushTickets: {
              quantityAvailable: 6,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      })
      .get("/shows/2/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 2,
            rushTickets: {
              quantityAvailable: 10,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getAllByLabelText, getByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
      </Stack.Navigator>
    );

    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    const showCards = getAllByLabelText("Show card");
    const firstShow = showCards[0];
    const secondShow = showCards[1];

    expect(firstShow).toHaveTextContent("SIX the Musical", {exact: false});
    expect(firstShow).toHaveTextContent("Tickets: 6", {exact: false});
    expect(firstShow).not.toHaveTextContent(
      "Rush is not unlocked for this show.",
      {exact: false}
    );

    expect(secondShow).toHaveTextContent("Hamilton", {exact: false});
    expect(secondShow).toHaveTextContent("Tickets: 10", {exact: false});
    expect(secondShow).toHaveTextContent(
      "Rush is not unlocked for this show.",
      {exact: false}
    );
    expect(getByLabelText("Inactive card")).toBeVisible();
  });

  it("unlocks all rush shows", async () => {
    await AsyncStorage.removeItem("customer-id");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/customers/me")
      .reply(200, {data: {id: "customer-id"}})
      .get("/customers/me/rushGrants")
      .reply(200, {data: []})
      .post("/customers/customer-id/rushGrants", {showId: 1})
      .reply(201, {data: [{showId: 1, showName: "SIX the Musical"}]})
      .get("/customers/me/rushGrants")
      .reply(200, {
        data: [{showId: 1, showName: "SIX the Musical"}]
      })
      .get("/shows")
      .query({
        areAccessProgramsActive: 1,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location: 2
      })
      .reply(200, {
        data: [
          {id: 1, displayName: "SIX the Musical", isRushActive: true, showId: 1}
        ]
      })
      .get("/shows/1/showtimes/with_rush_availability")
      .reply(200, {
        data: [
          {
            id: 1,
            rushTickets: {
              quantityAvailable: 6,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          }
        ]
      });

    const Stack = createStackNavigator<RushShowStackParamList>();
    const {getByText, getByLabelText, queryByLabelText} = render(
      <Stack.Navigator>
        <Stack.Screen name="RushShowList" component={RushShowListScreen} />
      </Stack.Navigator>
    );

    await waitFor(() => expect(getByText("SIX the Musical")).toBeVisible());
    const showCard = getByLabelText("Show card");

    expect(showCard).toHaveTextContent("SIX the Musical", {exact: false});
    expect(showCard).toHaveTextContent("Tickets: 6", {exact: false});
    await waitFor(() =>
      expect(getByLabelText("Show card")).not.toHaveTextContent(
        "Rush is not unlocked for this show.",
        {exact: false}
      )
    );
    expect(queryByLabelText("Inactive card")).toBeNull();
  });
});
