import express, { json, Request, Response } from "express";
import httpStatus from "http-status";

import { handleApplicationErrors } from "./middlewares/error-handler";

const app = express();
app.use(json());
app.get('/health', (req: Request, res: Response) => res.status(httpStatus.OK).send("It's alive"))
app.use(handleApplicationErrors)

export default app;
