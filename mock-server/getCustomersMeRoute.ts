import { Router } from "express";

import {
  TodayTixAPIv2ErrorResponse,
  TodayTixAPIv2Response
} from "../types/base";
import {
  MarketingEmailConsent,
  PrivacyLaw,
  TodayTixCustomer
} from "../types/customer";

const getCustomersMe200Response: TodayTixAPIv2Response<TodayTixCustomer> = {
  code: 200,
  data: {
    _type: "Customer",
    id: "customer-id",
    appleId: null,
    googleId: "google-id",
    confirmedEmailAddresses: ["good@gmail.com"],
    countryCode: 44,
    creditBalance: {
      value: 0.0,
      currency: "GBP",
      display: "£0",
      displayRounded: "£0"
    },
    defaultPaymentMethod: null,
    email: "good@gmail.com",
    facebookId: null,
    firstName: "Frank",
    lastName: "Enstein",
    marketingEmailConsent: MarketingEmailConsent.Granted,
    phone: "01234 567890",
    privacyLaw: PrivacyLaw.None,
    regionCode: "GB",
    rewardsBalance: {
      _type: "RewardsBalance",
      balance: {
        value: 3.54,
        currency: "GBP",
        display: "£3.54",
        displayRounded: "£3.54"
      },
      pendingBalance: null,
      expirationDate: "2024-09-01"
    },
    v1Token: "v1-token",
    canReceiveSms: false,
    traits: {
      recently_viewed_v2: "0",
      recently_viewed: ["0"]
    },
    homeLocationId: 2
  },
  pagination: null
};

const getCustomersMe401Response: TodayTixAPIv2ErrorResponse = {
  code: 401,
  error: "UnauthenticatedException",
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const getCustomersMeRoute = (router: Router) =>
  router.get<
    "/customers/me",
    null,
    TodayTixAPIv2Response<TodayTixCustomer> | TodayTixAPIv2ErrorResponse
  >("/customers/me", (req, res) => {
    if (req.headers["return-status"] === "401") {
      res.status(401).json(getCustomersMe401Response);
      return;
    }

    res.json(getCustomersMe200Response);
  });

export default getCustomersMeRoute;
