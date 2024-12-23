import React, {useCallback, useEffect, useState} from "react";
import {Dimensions, StyleSheet, View} from "react-native";

import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {useTheme} from "react-native-paper";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

export const ELEMENT_GAP = 15;
export const HANDLE_HEIGHT = 6;
export const BORDER_WIDTH = 3;

type BottomSheetProps = {
  header?: JSX.Element;
  content?: JSX.Element;
  isOpen?: boolean;
  bottomInset?: number;
};

/* This is a simple bottom sheet component. It snaps to the header and the full content of the bottom sheet and cannot be closed via a swipe down gesture.
It should be relatively easy to generalize this component if needed, e.g. let the user define their own snap points
while dynamically generating a snap point for the content, allow the user to close the bottom sheet by swiping down, etc. */

/* TODO: There is a small bug where, if the size of the content decreases or there is no longer content and/or a header, then
the bottom sheet immediately switches to the new state before the transition has finished, which leads to it looking a bit wonky
(to see this, press the "Retry" button when you cannot get tickets). */
const BottomSheet = ({
  header,
  content,
  isOpen = true,
  bottomInset = 0
}: BottomSheetProps) => {
  const {colors} = useTheme();

  const {height: screenHeight} = Dimensions.get("window");
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const bottomSnapPoint = screenHeight;
  /* These values are subtracted because the vertical (y) coordinate system starts from 0 at the top of the screen and
  increases as you go down the screen. */
  const handleSnapPoint =
    bottomSnapPoint -
    bottomInset -
    ELEMENT_GAP * 2 -
    HANDLE_HEIGHT -
    BORDER_WIDTH;
  const headerSnapPoint = handleSnapPoint - headerHeight;
  const contentSnapPoint = headerSnapPoint - contentHeight;

  const userSnapPoints = [headerSnapPoint, contentSnapPoint];

  const yPosition = useSharedValue(contentSnapPoint);

  const openBottomSheet = useCallback(() => {
    yPosition.value = withSpring(contentSnapPoint, {
      clamp: {min: contentSnapPoint}
    });
  }, [contentSnapPoint, yPosition]);

  const closeBottomSheet = useCallback(() => {
    yPosition.value = withSpring(bottomSnapPoint);
  }, [bottomSnapPoint, yPosition]);

  useEffect(
    () => (isOpen ? openBottomSheet() : closeBottomSheet()),
    [closeBottomSheet, isOpen, openBottomSheet]
  );

  const pan = Gesture.Pan()
    .onChange(({changeY}) => {
      yPosition.value = clamp(
        yPosition.value + changeY,
        contentSnapPoint,
        headerSnapPoint
      );
    })
    .onEnd(({velocityY}) => {
      const pointToSnapTo =
        velocityY <= 0
          ? userSnapPoints.find(snapPoint => snapPoint < yPosition.value) ??
            userSnapPoints.slice(-1)[0]
          : userSnapPoints
              .slice()
              .reverse()
              .find(snapPoint => snapPoint > yPosition.value) ??
            userSnapPoints[0];
      yPosition.value = withSpring(pointToSnapTo, {
        clamp: {min: contentSnapPoint, max: headerSnapPoint}
      });
    })
    .withTestId("bottom-sheet-pan-gesture");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: yPosition.value}]
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderColor: colors.primary
          },
          animatedStyle
        ]}
        testID="bottom-sheet">
        <View style={[styles.handle, {backgroundColor: colors.primary}]} />
        {/* The header and content components should not be conditionally rendered because,
        if the header or content is removed and the bottom sheet is re-rendered, onLayout will not
        be re-run, and so the height of the previous header or content remains in state, and so 
        the size of the re-rendered bottom sheet is wrong. */}
        <View
          onLayout={({nativeEvent}) =>
            setHeaderHeight(nativeEvent.layout.height)
          }
          style={header && styles.elementContainer}>
          {header}
        </View>
        <View
          onLayout={({nativeEvent}) =>
            setContentHeight(nativeEvent.layout.height)
          }
          style={content && styles.elementContainer}>
          {content}
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    borderTopWidth: BORDER_WIDTH,
    paddingHorizontal: "5%"
  },
  elementContainer: {paddingBottom: ELEMENT_GAP},
  handle: {
    width: "10%",
    height: HANDLE_HEIGHT,
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: ELEMENT_GAP
  }
});
