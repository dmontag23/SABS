import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";

import clearAllDataRoute from "./clearAllDataRoute";
import { oauthRouter, v2Router } from "./routers";

const app = express();
let server: Server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/oauth/v1", oauthRouter);
app.use("/api/v2", v2Router);
app.delete("/clearAllData", clearAllDataRoute);

const port = process.env.PORT || 3000;

export const startMockServer = async () =>
  await new Promise<void>(
    resolve =>
      (server = app.listen(port, () => {
        const serverAddress = server.address() as AddressInfo;
        console.log(`Running mock server on port '${serverAddress.port}'...`);
        resolve();
      }))
  );

export const closeMockServer = async () =>
  await new Promise<void>(resolve =>
    server.close(() => {
      console.log("Closed mock server.");
      resolve();
    })
  );
