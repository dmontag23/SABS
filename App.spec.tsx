import React from "react";
import {AppState} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {fireEvent, render, waitFor} from "@testing-library/react-native";
import nock from "nock";

import App from "./App";

describe("App component", () => {
  it("re-fetches data when the app is brought into the foreground", async () => {
    await AsyncStorage.multiSet([
      ["access-token", "access-token"],
      ["refresh-token", "refresh-token"],
      ["token-ttl", new Date("2024-01-01").getTime().toString()]
    ]);

    const appStateSpy = jest.spyOn(AppState, "addEventListener");
    nock(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`
    )
      .get("/holds")
      .reply(200, {
        data: [
          {
            id: 1,
            numSeats: 2,
            showtime: {show: {displayName: "Hamilton"}}
          }
        ]
      })
      .get("/holds")
      .reply(200, {data: []});

    const {getByText, getByTestId} = render(<App />);

    /* since jest does not run in a native environment, onLayout needs to be manually triggered
    see https://github.com/callstack/react-native-testing-library/issues/240#issuecomment-559877887 */
    await waitFor(() =>
      fireEvent(getByTestId("bottom-tab-bar-wrapper"), "onLayout", {
        nativeEvent: {layout: {width: 1, height: 1}}
      })
    );

    await waitFor(() =>
      expect(getByText("You've won 2 tickets to Hamilton 🎉")).toBeVisible()
    );
    const holdText = getByText("You've won 2 tickets to Hamilton 🎉");
    expect(appStateSpy).toBeCalledTimes(1);

    const onAppStateChange = appStateSpy.mock.calls[0][1];
    onAppStateChange("active");

    await waitFor(() => expect(holdText).not.toBeOnTheScreen());
  });
});
