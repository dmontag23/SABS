import { Router } from "express";

import { removeItemFromStore } from "./utils";

import {
  TodayTixAPIv2ErrorResponse,
  TodayTixAPIv2Response
} from "../types/base";

type DeleteHoldsRouteParams = {
  holdId: string;
};

const deleteHoldsRoute = (router: Router) =>
  router.delete<
    "/holds/:holdId",
    DeleteHoldsRouteParams,
    TodayTixAPIv2Response<{}> | TodayTixAPIv2ErrorResponse
  >("/holds/:holdId", (req, res) => {
    removeItemFromStore("holds", req.params.holdId);
    res.json({ code: 200, data: {} });
  });

export default deleteHoldsRoute;
