import React from "react";

import { render } from "testing-library/extension";

import ShowCard from "../ShowCard";

import { TodayTixShow } from "../../types/shows";
import { TodayTixShowtime } from "../../types/showtimes";

describe("The show card", () => {
  it("shows an active card when rush is open", () => {
    /* The typecast ensures an object without the many required show/showtime properties
    can be passed in*/
    const { getByText, queryByLabelText } = render(
      <ShowCard
        show={
          {
            displayName: "Six",
            lowPriceForRushTickets: { display: "£25" },
            images: {
              productMedia: { appHeroImage: { file: { url: "test-url" } } }
            }
          } as TodayTixShow
        }
        showtimes={[
          {
            id: 1,
            localTime: "14:00",
            rushTickets: {
              maxTickets: 2,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00",
              quantityAvailable: 6
            }
          } as TodayTixShowtime,
          {
            id: 2,
            localTime: "19:30",
            rushTickets: {
              maxTickets: 2,
              availableAfter: "2021-05-23T11:00:00.000+01:00",
              availableUntil: "2021-05-23T16:30:00.000+01:00"
            }
          } as TodayTixShowtime
        ]}
        isRushUnlocked={true}
      />
    );

    expect(getByText("10:00 to 15:30")).toBeVisible();
    expect(getByText("Six")).toBeVisible();
    expect(getByText("£25")).toBeVisible();
    expect(getByText("2 per person max")).toBeVisible();
    expect(getByText("14:00")).toBeVisible();
    expect(getByText("Tickets: 6")).toBeVisible();
    expect(getByText("19:30")).toBeVisible();
    expect(getByText("Tickets: 0")).toBeVisible();
    expect(queryByLabelText("Inactive card")).toBeNull();
  });

  it("shows an inactive card when rush is closed", () => {
    /* The typecast ensures an object without the many required show/showtime properties
    can be passed in*/
    const { queryByText, getByText, getByLabelText } = render(
      <ShowCard
        show={
          {
            displayName: "Six",
            lowPriceForRushTickets: { display: "£25" },
            images: {
              productMedia: { appHeroImage: { file: { url: "test-url" } } }
            }
          } as TodayTixShow
        }
        showtimes={[]}
        isRushUnlocked={true}
      />
    );

    expect(queryByText("10:00 to 15:30")).toBeNull();
    expect(getByText("Six")).toBeVisible();
    expect(queryByText("£25")).toBeNull();
    expect(queryByText("2 per person max")).toBeNull();
    expect(getByText("No tickets for today")).toBeVisible();
    expect(getByLabelText("Inactive card")).toBeVisible();
  });
});
