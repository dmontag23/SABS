import { Request, Response } from "express";

import { clearAllData } from "./utils";

const clearAllDataRoute = (req: Request, res: Response) => {
  clearAllData();
  res.sendStatus(200);
};

export default clearAllDataRoute;
