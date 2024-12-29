import {Router} from "express";

import {getItemsFromStore} from "./utils";

import {TodayTixAPIv2ErrorResponse, TodayTixAPIv2Response} from "../types/base";
import {TodayTixHold} from "../types/holds";

const getHoldsRoute = (router: Router) =>
  router.get<
    "/holds",
    null,
    TodayTixAPIv2Response<TodayTixHold[]> | TodayTixAPIv2ErrorResponse
  >("/holds", (req, res) => {
    const holds = getItemsFromStore<TodayTixHold>("holds");
    res.json({code: 200, data: holds ?? [], pagination: null});
  });

export default getHoldsRoute;
