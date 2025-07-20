import { Money, Platform, Rewards, TodayTixShow } from "./shows";

export enum Daypart {
  Evening = "EVENING",
  Matinee = "MATINEE"
}

export enum DayOfWeek {
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
  Sunday = "SUNDAY"
}

type PriceBand = {
  _type: string;
  price: Money;
  maxContiguousSeats: number;
  numAssignedSeatsAvailable: number;
};

type RegularTicketsInfo = {
  _type: string;
  availableUntil: string;
  availableUntilEpoch: number;
  availabilityLevel: unknown | null;
  showtimeFeeText: string | null;
  discount: number;
  discountForPDP: number;
  discountAmountForPDP: number;
  hasNoBookingFee: boolean;
  hasPromotion: boolean;
  lowPrice: Money;
  lowPriceForShowtimeSelection: Money;
  maxContiguousSeats: number;
  maxTickets: number;
  minTickets: number;
  numAssignedSeatsAvailable: number;
  priceBands: PriceBand[];
  promotionId: number | null;
  promotionLabel: string | null;
  promotionPlatforms: Platform[] | null;
  rewards: Rewards;
  savingsMessage: string | null;
  seatsioEventKey: string;
};

type LotteryTicketsInfo = {
  _type: string;
  availableAfter: string;
  availableAfterEpoch: number;
  availableUntil: string;
  availableUntilEpoch: number;
  lotteryBannerText: string;
  lotteryGroupId: number;
  lotteryGroupTitle: string;
  lowPrice: Money;
  maxTickets: number;
  minTickets: number;
};

type RushTicketsInfo = {
  _type: string;
  availableAfter: string;
  availableAfterEpoch: number;
  availableUntil: string;
  availableUntilEpoch: number;
  lowPrice: Money;
  maxContiguousSeats: number;
  maxTickets: number;
  minTickets: number;
  quantityAvailable: number;
  quantityHeld: number;
  rushBannerText: string;
};

export type TodayTixShowtime = {
  _type: string;
  admissionType: string;
  datetime: string;
  datetimeEpoch: number;
  dayOfWeek: DayOfWeek;
  daypart: Daypart;
  endDatetime: string | null;
  endDatetimeEpoch: number | null;
  endLocalDate: string | null;
  endLocalTime: string | null;
  id: number;
  localDate: string;
  localTime: string;
  lotteryTickets?: LotteryTicketsInfo | null;
  numDaysOut: number;
  partTwoDatetime: string | null;
  partTwoDatetimeEpoch: number | null;
  providerShowtimeId?: unknown | null;
  regularTickets?: RegularTicketsInfo | null;
  rushTickets?: RushTicketsInfo | null;
  show?: TodayTixShow;
};
