import {useContext} from "react";

import {renderHook} from "testing-library/extension";

import SelectedShowtimeContext from "../selected-showtime-context";

describe("The selected showtime context", () => {
  it("defaults values correctly", () => {
    const {result} = renderHook(() => useContext(SelectedShowtimeContext));

    expect(result.current.selectedShow).toBeUndefined();
    expect(result.current.selectedShowtime).toBeUndefined();
    expect(result.current.selectedNumberOfTickets).toBeUndefined();
    expect(result.current.setSelectedShow(undefined)).toBeUndefined();
    expect(result.current.setSelectedShowtime(undefined)).toBeUndefined();
    expect(result.current.setSelectedNumberOfTickets(1)).toBeUndefined();
  });
});
