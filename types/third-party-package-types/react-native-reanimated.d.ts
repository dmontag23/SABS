/* This file should not be needed, but right now explicit extension of the
jest global expect types do not ship with reanimated. See 
https://github.com/software-mansion/react-native-reanimated/issues/6848 */
export * from "@jest/expect";

// Explicit `@jest/globals` `expect` matchers.
declare module "@jest/expect" {
  interface Matchers<R> {
    toHaveAnimatedStyle(
      style: Record<string, unknown>[] | Record<string, unknown>,
      config?: {
        shouldMatchAllProps?: boolean;
      }
    ): R;
  }
}
