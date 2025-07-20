import { Money } from "./shows";
import { TodayTixShowtime } from "./showtimes";

export enum TodayTixHoldType {
  Rush = "RUSH"
}

export type TodayTixHoldsReq = {
  showtime: number;
  customer: string;
  holdType: TodayTixHoldType;
  numTickets: number;
};

type Currency = {
  _type: string;
  displayName: string;
  name: string;
  symbol: string;
};

export enum DeliveryMethodEnum {
  Barcode = "BARCODE"
}

type HoldConfigurableTexts = {
  _type: string;
  aboutSeatsButton: unknown | null;
  amountDisplayForWeb: string;
  amountIncludingFeesText: string;
  bestPriceGuaranteedText: string;
  deliveryInstructions: string;
  deliveryInstructionsForMobile: unknown | null;
  feeButtonEnabled: boolean;
  feesButtonText: string;
  feePerTicketButtonText: string;
  feeTextPerTicket: unknown | null;
  optionalText: unknown | null;
  optionalTitle: unknown | null;
  saveTextForMobile: string;
  saveTextForWeb: string;
  soYouKnowText: string;
  subtotalTitle: string;
  ticketPriceInfoText: string;
  totalAmountTitle: string;
  youRequestedText: string;
};

type BasePrice = {
  _type: string;
  details: string;
  displaySubtext: unknown | null;
  full: string;
  result: string;
  resultSymbol: string;
  title: string;
  total: Money;
  description: unknown | null;
};

type LocalPrices = {
  _type: string;
  localCalculatedTotal: Money;
  localCurrency: Currency;
  localPriceItems: BasePrice[];
  localTotalSalesTaxAmount: Money;
  localAvailableTicketProtectionFeeAmount: unknown | null;
  localTotalAmountSaved: Money;
};

export enum ProviderPlatformEnum {
  TodayTix = "TODAYTIX"
}

type PspOption = {
  _type: string;
  merchantAccount: string;
  paymentGatewayType: string;
  paymentSession:
    | {
        braintreeClientToken: string;
      }
    | {};
  thirdPartyPaymentsEnabled: string[];
  isPrimaryPsp: boolean;
};

type RetailerDepartment = {
  _type: string;
  id: number;
  name: string;
};

type RetailerVertical = {
  _type: string;
  id: number;
  name: string;
  department: RetailerDepartment;
};

type Retailer = {
  _type: string;
  id: number;
  name: string;
  pubId: string;
  vertical: RetailerVertical;
};

type EarnedRewardsSummary = {
  _type: string;
  balance: Money;
  rewardsAmount: unknown | null;
  earnedCredit: unknown | null;
};

type SeatsInfo = {
  doorInfo: unknown | null;
  endSeat: unknown | null;
  row: string;
  seats: string[];
  sectionCode: string;
  sectionName: string;
  startSeat: string;
  seatsDetails: unknown[];
};

type DeliveryMethod = {
  method: DeliveryMethodEnum;
  postPurchaseText: string;
  prePurchaseText: string;
  price: Money;
};

export type TodayTixHold = {
  _type: string;
  id: number;
  admissionType: string;
  accessibilityText: string | null;
  allocatedSeatId: number;
  availableTicketProtection: unknown | null;
  baseTotal: Money;
  braintreeClientToken: string;
  localBraintreeClientToken: string;
  calculatedTotal: Money;
  configurableTexts: HoldConfigurableTexts;
  createdDatetime: string;
  credits: unknown | null;
  currency: Currency;
  customerId: string;
  deliveryMethod: DeliveryMethodEnum;
  deliveryMethodId: number;
  expirationDatetime: string;
  faceValuePerTicket: Money;
  fractionalDiscount: number;
  hasPromotion: boolean;
  holdExpirationTime: string;
  holdTimeAllowedSeconds: number;
  isEligibleForQuickCheckout: boolean;
  isPotentialDuplicate: boolean;
  localPrices: LocalPrices;
  numSeats: number;
  paymentCaptureType: string;
  paymentMethods: unknown | null;
  paymentOption: string;
  partTwoShowDatetime: unknown | null;
  priceItems: BasePrice[];
  promotion: unknown | null;
  provider: string;
  providerId: number;
  providerName: string;
  providerPlatformEnum: ProviderPlatformEnum;
  pspOptions: PspOption[];
  localPspOptions: PspOption[];
  reservedOfferHold: unknown | null;
  retailer: Retailer;
  retailerId: string;
  rewards: EarnedRewardsSummary;
  seatSelectionType: string;
  seatsInfo: SeatsInfo;
  secret: string;
  sectionDescriptionMetadata: unknown | null;
  showEndDatetime: unknown | null;
  showDatetime: string;
  showId: number;
  showtime: TodayTixShowtime;
  subTotal: Money;
  supportedDeliveryMethods: DeliveryMethod[];
  ticketProtectionPlanId: unknown | null;
  ticketType: TodayTixHoldType;
  ticketsType: TodayTixHoldType;
  totalAmountSaved: Money;
  totalPricePerTicket: Money;
  totalTicketDiscount: Money;
  totalSalesTaxAmount: Money;
  venueAreaIds: unknown | null;
  voucher: unknown | null;
  voucherApplicationMessage: unknown | null;
  voucherCode: string;
  voucherDiscount: unknown | null;
};

export enum TodayTixHoldErrorCode {
  CONFLICT = "Conflict",
  SEATS_TAKEN = "AllSeatsInOtherUserCarts",
  UNAUTHENTICATED = "UnauthenticatedException"
}
