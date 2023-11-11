import httpStatus from "http-status";
import { Request, Response } from "express";

import { CreateGame } from "../protocols";
import { gameServices } from "../services/games-services";

async function createGame(req: Request, res: Response) {
    const newGame = req.body as CreateGame
    const create = await gameServices.createGame(newGame)
    return res.status(httpStatus.CREATED).send(create)
}

export const gameController = { createGame }