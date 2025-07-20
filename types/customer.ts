import { Money } from "./shows";

export enum MarketingEmailConsent {
  Granted = "GRANTED"
}

export enum PrivacyLaw {
  None = "NONE"
}

type RewardsBalance = {
  _type: string;
  balance: Money;
  pendingBalance: Money | null;
  expirationDate: string;
};

export type TodayTixCustomer = {
  _type: string;
  id: string;
  appleId: unknown | null;
  googleId: string;
  confirmedEmailAddresses: string[];
  countryCode: number;
  creditBalance: Money;
  defaultPaymentMethod: unknown | null;
  email: string;
  facebookId: unknown | null;
  firstName: string;
  lastName: string;
  marketingEmailConsent: MarketingEmailConsent.Granted;
  phone: string;
  privacyLaw: PrivacyLaw.None;
  regionCode: string;
  rewardsBalance: RewardsBalance;
  v1Token: string;
  canReceiveSms: boolean;
  traits: {
    recently_viewed_v2: string;
    recently_viewed: string[];
  };
  homeLocationId: number;
};
