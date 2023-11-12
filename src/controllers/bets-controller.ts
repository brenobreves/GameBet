import httpStatus from "http-status";
import { Request, Response } from "express";

import { CreateBet } from "../protocols";
import { betServices } from "../services/bets-services";

async function createBet(req: Request, res: Response) {
    const newBet = req.body as CreateBet
    newBet.amountBet = Number(newBet.amountBet)
    newBet.homeTeamScore = Number(newBet.homeTeamScore)
    newBet.awayTeamScore = Number(newBet.awayTeamScore)
    newBet.participantId = Number(newBet.participantId)
    newBet.gameId = Number(newBet.gameId)
    const create = await betServices.createBet(newBet)
    return res.status(httpStatus.CREATED).send(create)
}

export const betController = { createBet }