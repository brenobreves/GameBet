import prisma from "../database";
import { CreateGame } from "../protocols";

async function createGame(game: CreateGame) {
    return await prisma.game.create({
        data: game
    })
}

async function getGames() {
    return await prisma.game.findMany({})
}

export const gameRepository = { createGame, getGames }