import { gameRepository } from "../repositories/games-repository";
import { CreateGame } from "../protocols";
import { invalidDataError } from "../errors/invalid-data-erro";

async function createGame(game: CreateGame) {
    if(!isNaN(Number(game.awayTeamName)) || !isNaN(Number(game.homeTeamName))){
        throw invalidDataError("Teams names shouldn't be numbers, "+`homeTeam: ${game.homeTeamName} awayTeam: ${game.awayTeamName}`)
    }
    return await gameRepository.createGame(game)
}

export const gameServices = { createGame } 