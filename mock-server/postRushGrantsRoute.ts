import {Router} from "express";

import {writeItemToStore} from "./utils";

import {TodayTixAPIError, TodayTixAPIRes} from "../types/base";
import {TodayTixRushGrant, TodayTixRushGrantsReq} from "../types/rushGrants";

type RouteParams = {
  customerId: string;
};

const postRushGrants401Response: TodayTixAPIError = {
  code: 401,
  error: "UnauthenticatedException",
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const postRushGrantsRoute = (router: Router) =>
  router.post<
    "/customers/:customerId/rushGrants",
    RouteParams,
    TodayTixAPIRes<TodayTixRushGrant> | TodayTixAPIError,
    TodayTixRushGrantsReq
  >("/customers/:customerId/rushGrants", (req, res) => {
    if (req.body.showId === 4)
      return res.status(401).json(postRushGrants401Response);

    const newRushGrant: TodayTixRushGrant = {
      _type: "RushGrant",
      dateGranted: new Date().toISOString(),
      showId: req.body.showId,
      showName: `Show for ${req.params.customerId}`
    };

    const rushGrantToReturn = writeItemToStore(
      "rush-grants",
      req.body.showId.toString(),
      newRushGrant
    );

    if (!rushGrantToReturn)
      return res.status(500).json({
        code: 500,
        error: `Internal server error trying to write rush grant for show id ${newRushGrant.showId} to the file system.`
      });

    return res.status(201).json({
      code: 201,
      data: rushGrantToReturn
    });
  });

export default postRushGrantsRoute;
