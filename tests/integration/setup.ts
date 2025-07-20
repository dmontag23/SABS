/* The following import and mock are needed for AsyncStorage.
See https://react-native-async-storage.github.io/async-storage/docs/advanced/jest */
import MockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import nock from "nock";
/* The following import is needed for react navigation. 
See https://reactnavigation.org/docs/testing/ */
import "react-native-gesture-handler/jestSetup";
import { setUpTests } from "react-native-reanimated";
import { act } from "testing-library/extension";

setUpTests();

jest.mock("@react-native-async-storage/async-storage", () => MockAsyncStorage);

jest.mock("@sentry/react-native", () => ({
  init: jest.fn()
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
  jest.clearAllTimers();
  act(jest.runOnlyPendingTimers);
  nock.cleanAll();
  MockAsyncStorage.clear();
});
