import { Router } from "express";

import { TodayTixOauthAPIErrorResponse } from "../types/base";
import {
  TodayTixRefreshTokenReq,
  TodayTixRefreshTokenRes
} from "../types/loginTokens";

const postToken200Response: TodayTixRefreshTokenRes = {
  access_token: "access-token",
  token_type: "Bearer",
  original_token_id: "original-token-id",
  expires_in: 1800,
  scope: "customer"
};

const postToken400Response: TodayTixOauthAPIErrorResponse = {
  error_description: "Request is missing username parameter.",
  error: "invalid_request"
};

const postTokenRoute = (router: Router) =>
  router.post<
    "/token",
    null,
    TodayTixRefreshTokenRes | TodayTixOauthAPIErrorResponse,
    TodayTixRefreshTokenReq
  >("/token", (req, res) => {
    if (req.body.refresh_token === "refresh-token") {
      res.json(postToken200Response);
      return;
    }

    res.status(400).json(postToken400Response);
  });

export default postTokenRoute;
