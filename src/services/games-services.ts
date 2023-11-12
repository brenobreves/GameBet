import { gameRepository } from "../repositories/games-repository";
import { CreateGame } from "../protocols";
import { invalidDataError } from "../errors/invalid-data-erro";
import { NotFoundError } from "../errors/not-found-erro";

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

export const gameServices = { createGame, getGames, getGameWithBets } 