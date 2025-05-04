import {act, renderHook} from "testing-library/extension";

import useScheduleCallback from "../useScheduleCallback";

describe("useScheduleCallback hook", () => {
  it("runs callback immediately by default", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    act(() => result.current.scheduleCallback(0));
    expect(callbackFn).not.toBeCalled();
    act(() => jest.runOnlyPendingTimers());
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("runs callback after a delay of 5 seconds", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
      )
    );
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("clears a timeout when cancelling callback execution", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
      )
    );
    act(() => result.current.cancelScheduledExecution());
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toBeCalled();
  });

  it("does not schedule a new callback if one is already scheduled", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
      )
    );
    act(() => result.current.scheduleCallback(0));
    jest.advanceTimersByTime(1000);
    expect(callbackFn).not.toBeCalled();
    act(() => jest.advanceTimersByTime(4000));
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("can reschedule a callback", () => {
    const callbackFn = jest.fn();
    const {result} = renderHook(() => useScheduleCallback(callbackFn));

    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
      )
    );
    jest.advanceTimersByTime(4999);
    expect(callbackFn).not.toBeCalled();
    act(() => result.current.cancelScheduledExecution());
    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 6).getTime() / 1000
      )
    );
    jest.advanceTimersByTime(1);
    expect(callbackFn).not.toBeCalled();
    act(() => jest.advanceTimersByTime(1000));
    expect(callbackFn).toBeCalledTimes(1);
  });

  it("clears timeout when unmounted", () => {
    const callbackFn = jest.fn();
    const {result, unmount} = renderHook(() => useScheduleCallback(callbackFn));

    act(() =>
      result.current.scheduleCallback(
        new Date(2021, 4, 23, 0, 0, 5).getTime() / 1000
      )
    );
    unmount();
    jest.advanceTimersByTime(5000);
    expect(callbackFn).not.toHaveBeenCalled();
  });

  it("shows correct isScheduled status after cancelling a schedule", () => {
    const {result} = renderHook(() => useScheduleCallback(jest.fn()));

    act(() => result.current.scheduleCallback(0));
    expect(result.current.isScheduled).toBe(true);
    act(() => result.current.cancelScheduledExecution());
    expect(result.current.isScheduled).toBe(false);
  });

  it("shows correct isScheduled status after executing the callback", async () => {
    const {result} = renderHook(() => useScheduleCallback(jest.fn()));

    act(() => result.current.scheduleCallback(0));
    expect(result.current.isScheduled).toBe(true);
    act(() => jest.runOnlyPendingTimers());
    expect(result.current.isScheduled).toBe(false);
  });
});
