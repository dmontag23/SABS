import React from "react";
import { Dimensions } from "react-native";

import { PanGesture } from "react-native-gesture-handler";
import {
  fireGestureHandler,
  getByGestureTestId
} from "react-native-gesture-handler/jest-utils";
import { Text } from "react-native-paper";
import { fireEvent, render, waitFor } from "testing-library/extension";

import BottomSheet, {
  BORDER_WIDTH,
  ELEMENT_GAP,
  HANDLE_HEIGHT
} from "../BottomSheet";

describe("BottomSheet component", () => {
  it("snaps to the correct positions when open", async () => {
    const header = <Text>Header</Text>;
    const content = <Text>Content</Text>;

    const { getByText, getByTestId } = render(
      <BottomSheet header={header} content={content} />
    );

    const { height: screenHeight } = Dimensions.get("window");
    const headerHeight = 100;
    const contentHeight = 500;
    const headerSnapPoint =
      screenHeight -
      ELEMENT_GAP * 2 -
      HANDLE_HEIGHT -
      BORDER_WIDTH -
      headerHeight;
    const contentSnapPoint = headerSnapPoint - contentHeight;

    fireEvent(getByText("Header"), "onLayout", {
      nativeEvent: { layout: { height: headerHeight } }
    });
    fireEvent(getByText("Content"), "onLayout", {
      nativeEvent: { layout: { height: contentHeight } }
    });
    jest.runAllTimers();

    const bottomSheet = getByTestId("bottom-sheet");
    /* TODO: Note that there's a race condition where the gesture handlers sometimes do not get
    registered in time in node_modules/react-native-gesture-handler/lib/commonjs/handlers/handlersRegistry.js
    after the component re-renders. This causes fireGestureHandler below to act on an old version of the gesture
    and so the test fails. The await here isn't strictly necessary, but it helps prevent this race condition
    from occurring. There may be a better way to handle this that should be looked into. */
    await waitFor(() =>
      expect(bottomSheet).toHaveAnimatedStyle({
        transform: [{ translateY: contentSnapPoint }]
      })
    );

    // pull down on the bottom sheet
    fireGestureHandler<PanGesture>(
      getByGestureTestId("bottom-sheet-pan-gesture"),
      [
        { translationY: contentSnapPoint },
        { translationY: contentSnapPoint + 1, velocityY: 1 }
      ]
    );
    jest.runAllTimers();
    expect(bottomSheet).toHaveAnimatedStyle({
      transform: [{ translateY: headerSnapPoint }]
    });

    // pull down on the bottom sheet again to ensure it does not close
    fireGestureHandler<PanGesture>(
      getByGestureTestId("bottom-sheet-pan-gesture"),
      [
        { translationY: headerSnapPoint },
        { translationY: headerSnapPoint + 1, velocityY: 1 }
      ]
    );
    jest.runAllTimers();
    expect(bottomSheet).toHaveAnimatedStyle({
      transform: [{ translateY: headerSnapPoint }]
    });

    // pull up on the bottom sheet
    fireGestureHandler<PanGesture>(
      getByGestureTestId("bottom-sheet-pan-gesture"),
      [
        { translationY: headerSnapPoint },
        { translationY: headerSnapPoint - 1, velocityY: -1 }
      ]
    );
    jest.runAllTimers();
    expect(bottomSheet).toHaveAnimatedStyle({
      transform: [{ translateY: contentSnapPoint }]
    });

    // pull up on the bottom sheet again to ensure it does not go anywhere
    fireGestureHandler<PanGesture>(
      getByGestureTestId("bottom-sheet-pan-gesture"),
      [
        { translationY: contentSnapPoint },
        { translationY: contentSnapPoint - 1, velocityY: -1 }
      ]
    );
    jest.runAllTimers();
    expect(bottomSheet).toHaveAnimatedStyle({
      transform: [{ translateY: contentSnapPoint }]
    });
  });
});
