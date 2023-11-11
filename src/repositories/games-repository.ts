import prisma from "../database";
import { CreateGame } from "../protocols";

async function createGame(game: CreateGame) {
    return await prisma.game.create({
        data: game
    })
}

export const gameRepository = { createGame }