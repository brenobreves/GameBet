import httpStatus from "http-status";
import { Request, Response } from "express";

import { CreateGame, FinishGame } from "../protocols";
import { gameServices } from "../services/games-services";
import validateParamsId from "../utils/validate-params-id";

async function createGame(req: Request, res: Response) {
    const newGame = req.body as CreateGame
    const create = await gameServices.createGame(newGame)
    return res.status(httpStatus.CREATED).send(create)
}

async function getGames(req: Request, res: Response) {
    const gamesList = await gameServices.getGames()
    return res.status(httpStatus.OK).send(gamesList)
}

async function getGameWithBets(req: Request, res: Response) {
    const gameId = validateParamsId(req.params)
    const gameInfo = await gameServices.getGameWithBets(Number(gameId))
    gameInfo['bets'] = gameInfo['Bet']
    delete gameInfo['Bet']
    return res.status(httpStatus.OK).send(gameInfo)
}

async function finishGame(req: Request, res: Response) {
    const gameId = validateParamsId(req.params)
    const score = req.body as FinishGame
    score.homeTeamScore = Number(score.homeTeamScore)
    score.awayTeamScore = Number(score.awayTeamScore)
    const update = await gameServices.finishGame(gameId,score)
    return res.status(httpStatus.OK).send(update)

}



export const gameController = { createGame, getGames, getGameWithBets, finishGame }