import { useContext } from "react";

import { renderHook } from "testing-library/extension";

import HoldContext from "../hold-context";

describe("The hold context", () => {
  it("defaults values correctly", () => {
    const { result } = renderHook(() => useContext(HoldContext));

    expect(result.current.isCreatingHold).toBe(false);
    expect(result.current.createHoldError).toBeNull();
    expect(result.current.isHoldScheduled).toBe(false);
    expect(
      result.current.scheduleHold(0, {
        customerId: "",
        showtimeId: NaN,
        numTickets: NaN
      })
    ).toBeUndefined();
    expect(result.current.cancelHold()).toBeUndefined();
    expect(result.current.hold).toBeUndefined();
  });
});
