/* The following import is needed for react navigation. 
See https://reactnavigation.org/docs/testing/ */

/* The following import and mock are needed for AsyncStorage.
See https://react-native-async-storage.github.io/async-storage/docs/advanced/jest */
import {afterEach, beforeEach, jest} from "@jest/globals";
import MockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "@testing-library/react-native/extend-expect";
import nock from "nock";
import "react-native-gesture-handler/jestSetup";
import {act} from "testing-library/extension";

jest.mock("@react-native-async-storage/async-storage", () => MockAsyncStorage);

// The following is needed to test reanimated, see https://reactnavigation.org/docs/testing/#mocking-native-modules
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock("@gorhom/bottom-sheet", () => ({
  ...require("@gorhom/bottom-sheet/mock"),
  __esModule: true
}));

export const systemTime = new Date(2021, 4, 23);

beforeEach(() => {
  /* useFakeTimers is needed for animated components and to mock the system time
  see https://github.com/jestjs/jest/issues/6434
  the doNotFake option is due to an open issue with nock/react testing library
  see https://github.com/nock/nock/issues/2200 */
  jest
    .useFakeTimers({
      doNotFake: ["nextTick", "setImmediate"]
    })
    .setSystemTime(systemTime);
});

afterEach(() => {
  act(jest.runOnlyPendingTimers);
  jest.useRealTimers();
  jest.clearAllMocks();
  nock.abortPendingRequests();
  nock.cleanAll();
  MockAsyncStorage.clear();
});
