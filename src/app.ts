import express, { json, Request, Response } from "express";
import "express-async-errors";
import httpStatus from "http-status";


import { handleApplicationErrors } from "./middlewares/error-handler";
import participantRouter from "./routers/participants-router";
import gamesRouter from "./routers/games-router";
import betsRouter from "./routers/bets-router";

const app = express();
app.use(json());
app.get('/health', (req: Request, res: Response) => res.status(httpStatus.OK).send("It's alive"))
app.use('/participants', participantRouter)
app.use('/games', gamesRouter)
app.use('/bets', betsRouter)
app.use(handleApplicationErrors)

export default app;
