import httpStatus from "http-status";
import { Request, Response } from "express";

import { CreateGame } from "../protocols";
import { gameServices } from "../services/games-services";
import { invalidDataError } from "../errors/invalid-data-erro";

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
    const {id} = req.params
    if(!Number.isInteger(Number(id))) throw invalidDataError("id params must be a integer number")
    if(Number(id) <= 0) throw invalidDataError("id params must be a integer number greater than 0")
    const gameId = Number(id)
    const gameInfo = await gameServices.getGameWithBets(Number(gameId))
    gameInfo['bets'] = gameInfo['Bet']
    delete gameInfo['Bet']
    return res.status(httpStatus.OK).send(gameInfo)
}

export const gameController = { createGame, getGames, getGameWithBets }