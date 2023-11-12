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

async function getGameById(id: number) {
    return prisma.game.findFirst({
        where:{
            id
        }
    })
}

export const gameRepository = { createGame, getGames, getGameById }