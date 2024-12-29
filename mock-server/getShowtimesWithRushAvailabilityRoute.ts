import {Router} from "express";

import {TodayTixAPIv2ErrorResponse, TodayTixAPIv2Response} from "../types/base";
import {DayOfWeek, Daypart, TodayTixShowtime} from "../types/showtimes";

const getShowtimesWithRushSix200Response: TodayTixAPIv2Response<
  TodayTixShowtime[]
> = {
  code: 200,
  data: [
    {
      _type: "Showtime",
      id: 1,
      admissionType: "TIMED",
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: "2024-02-27T19:00:00.000",
      datetimeEpoch: 1709060400,
      daypart: Daypart.Evening,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: "2024-02-27",
      localTime: "19:00",
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: "RushTicketsInfo",
        availableAfter: "2024-02-27T09:30:00.000",
        availableAfterEpoch: 1709026200,
        availableUntil: "2024-02-27T16:00:00.000",
        availableUntilEpoch: 1709049600,
        lowPrice: {
          value: 25,
          currency: "GBP",
          display: "£25",
          displayRounded: "£25"
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 6,
        quantityHeld: 0,
        rushBannerText: "£25 Rush tickets"
      }
    }
  ]
};

const getShowtimesWithRushWicked200Response: TodayTixAPIv2Response<
  TodayTixShowtime[]
> = {
  code: 200,
  data: []
};

const getShowtimesWithRushGuysNDolls200Response: TodayTixAPIv2Response<
  TodayTixShowtime[]
> = {
  code: 200,
  data: [
    {
      _type: "Showtime",
      id: 2,
      admissionType: "TIMED",
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      // This ensures there is always a showtime to select that will
      // be in the future
      datetime: "3000-12-31T23:59:59.000",
      datetimeEpoch: 32535215999,
      daypart: Daypart.Matinee,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: "3000-12-31",
      localTime: "23:59",
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: "RushTicketsInfo",
        availableAfter: "3000-12-31T11:59:59.000",
        availableAfterEpoch: 32535172799,
        availableUntil: "3000-12-31T23:59:59.000",
        availableUntilEpoch: 32535215999,
        lowPrice: {
          value: 25,
          currency: "GBP",
          display: "£25",
          displayRounded: "£25"
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 5,
        quantityHeld: 2,
        rushBannerText: "£25 Rush tickets"
      }
    },
    {
      _type: "Showtime",
      id: 3,
      admissionType: "TIMED",
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: "2024-02-27T19:30:00.000",
      datetimeEpoch: 1709062200,
      daypart: Daypart.Evening,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: "2024-02-27",
      localTime: "19:30",
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: "RushTicketsInfo",
        availableAfter: "2024-02-27T11:00:00.000",
        availableAfterEpoch: 1709031600,
        availableUntil: "2024-02-27T17:30:00.000",
        availableUntilEpoch: 1709055000,
        lowPrice: {
          value: 25,
          currency: "GBP",
          display: "£25",
          displayRounded: "£25"
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 10,
        quantityHeld: 2,
        rushBannerText: "£25 Rush tickets"
      }
    }
  ]
};

const getShowtimesWithRushTina200Response: TodayTixAPIv2Response<
  TodayTixShowtime[]
> = {
  code: 200,
  data: [
    {
      _type: "Showtime",
      id: 4,
      admissionType: "TIMED",
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: "2024-02-27T19:00:00.000",
      datetimeEpoch: 1709060400,
      daypart: Daypart.Evening,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: "2024-02-27",
      localTime: "19:00",
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: "RushTicketsInfo",
        availableAfter: "2024-02-27T09:30:00.000",
        availableAfterEpoch: 1709026200,
        availableUntil: "2024-02-27T16:00:00.000",
        availableUntilEpoch: 1709049600,
        lowPrice: {
          value: 25,
          currency: "GBP",
          display: "£25",
          displayRounded: "£25"
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 7,
        quantityHeld: 0,
        rushBannerText: "£25 Rush tickets"
      }
    }
  ]
};

const getShowtimesWithRush400Response: TodayTixAPIv2ErrorResponse = {
  code: 400,
  error: "InvalidParameter",
  context: {
    parameterName: null,
    internalMessage:
      "Property [id] of class [class com.todaytix.api.v2.validation.GetShowtimesInput] with value [0] is less than minimum value [1]"
  },
  title: "Error",
  message:
    "Property [id] of class [class com.todaytix.api.v2.validation.GetShowtimesInput] with value [0] is less than minimum value [1]"
};

const getShowtimesWithRushAvailabilityRoute = (router: Router) =>
  router.get<
    "/shows/:showId/showtimes/with_rush_availability",
    {showId: string},
    TodayTixAPIv2Response<TodayTixShowtime[]> | TodayTixAPIv2ErrorResponse
  >("/shows/:showId/showtimes/with_rush_availability", (req, res) => {
    switch (req.params.showId) {
      case "1":
        res.json(getShowtimesWithRushSix200Response);
        break;
      case "2":
        res.json(getShowtimesWithRushWicked200Response);
        break;
      case "3":
        res.json(getShowtimesWithRushGuysNDolls200Response);
        break;
      case "4":
        res.json(getShowtimesWithRushTina200Response);
        break;
      case "24608":
        res.json({code: 200, data: []});
        break;
      default:
        res.status(400).json(getShowtimesWithRush400Response);
    }
  });

export default getShowtimesWithRushAvailabilityRoute;
