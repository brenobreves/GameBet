import prisma from "../database";

import { gameRepository } from "../repositories/games-repository";
import { CreateGame, FinishGame, TransactionClient } from "../protocols";
import { invalidDataError } from "../errors/invalid-data-erro";
import { NotFoundError } from "../errors/not-found-erro";
import { ForbiddenError } from "../errors/forbidden-erro";
import { betRepository } from "../repositories/bets-repository";
import { participantRepository } from "../repositories/participants-repository";


async function createGame(game: CreateGame) {
    if(!isNaN(Number(game.awayTeamName)) || !isNaN(Number(game.homeTeamName))){
        throw invalidDataError("Teams names shouldn't be numbers, "+`homeTeam: ${game.homeTeamName} awayTeam: ${game.awayTeamName}`)
    }
    return await gameRepository.createGame(game)
}

async function getGames() {
    return await gameRepository.getGames()
}

async function getGameWithBets(gameId: number) {
    const gameInfo = await gameRepository.getGameWithBets(gameId)
    if(!gameInfo) throw NotFoundError(`Game with id: ${gameId}`)
    return gameInfo
}

async function finishGame(gameId: number, score: FinishGame) {
    const game = await gameRepository.getGameById(gameId)
    if(!game) throw NotFoundError(`Game with id: ${gameId}`)
    if(game.isFinished) throw ForbiddenError(`Game with id: ${gameId} is already over`)
    let updatedGameObj = {}
    const houseFee = 0.3
    await prisma.$transaction(async (tx:TransactionClient) =>{
        const updateGame = await gameRepository.finishGame(gameId,score,tx)
        const updateLostBet = await betRepository.setLostBets(gameId,score,tx)
        const totalWon = await betRepository.getTotalBetWonByGameId(gameId,score,tx)
        if(totalWon._sum.amountBet !== 0){
            const totalGameBet = await betRepository.getTotalBetByGameId(gameId,tx)
            const totalCut = Math.floor(totalGameBet._sum.amountBet * (1-houseFee))
            const earnRate = totalCut/totalWon._sum.amountBet
            const queryFilter = {gameId,score}
            const setWonBet = await betRepository.setWonBets(queryFilter,earnRate,tx)
            const updateWonBalances = await participantRepository.updateWonBalance(gameId,tx)
        }
        updatedGameObj = updateGame
    })
    return updatedGameObj
}

export const gameServices = { createGame, getGames, getGameWithBets, finishGame } 