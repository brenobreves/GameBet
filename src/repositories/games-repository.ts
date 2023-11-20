import prisma from "../database";
import { CreateGame, FinishGame, TransactionClient } from "../protocols";

async function createGame(game: CreateGame) {
    return await prisma.game.create({
        data: game
    })
}

async function getGames() {
    return await prisma.game.findMany({})
}

async function getGameById(id: number) {
    return await prisma.game.findFirst({
        where:{
            id
        }
    })
}

async function getGameWithBets(id: number) {
    return await prisma.game.findFirst({
        where:{
            id
        },
        include:{
            Bet:true
        }
    })
}

async function finishGame(id: number, score: FinishGame, client:TransactionClient) {
    return await client.game.update({
        where:{
            id
        },
        data:{
            isFinished: true,
            homeTeamScore: score.homeTeamScore,
            awayTeamScore: score.awayTeamScore
        }
    })
}

export const gameRepository = { createGame, getGames, getGameById, getGameWithBets, finishGame }