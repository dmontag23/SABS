import { Router } from "express";

import { getItemsFromStore } from "./utils";

import {
  TodayTixAPIv2ErrorResponse,
  TodayTixAPIv2Response
} from "../types/base";
import { TodayTixRushGrant } from "../types/rushGrants";

const getRushGrants401Response: TodayTixAPIv2ErrorResponse = {
  code: 401,
  error: "UnauthenticatedException",
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const getRushGrantsRoute = (router: Router) =>
  router.get<
    "/customers/me/rushGrants",
    null,
    TodayTixAPIv2Response<TodayTixRushGrant[]> | TodayTixAPIv2ErrorResponse
  >("/customers/me/rushGrants", (req, res) => {
    if (req.headers["return-status"] === "401") {
      res.status(401).json(getRushGrants401Response);
      return;
    }

    const rushGrants = getItemsFromStore<TodayTixRushGrant>("rush-grants");

    res.json({ code: 200, data: rushGrants ?? [], pagination: null });
  });

export default getRushGrantsRoute;
