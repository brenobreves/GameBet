import prisma from "../database";
import { CreateBet, FinishGame } from "../protocols";

async function createBet(bet: CreateBet, client: any) {
    return await client.bet.create({
        data: bet
    })
}

async function setLostBets(gameId: number, score: FinishGame, client: any) {
    return client.bet.updateMany({
        where: {
            gameId: gameId,
            OR: [
              { homeTeamScore: { not: score.homeTeamScore } },
              { awayTeamScore: { not: score.awayTeamScore } },
            ],
          },
          data: {
            status: 'LOST',
            amountWon: 0,
          }
    })
}

async function getTotalBetByGameId(gameId: number, client: any) {
    return client.bet.aggregate({
        _sum:{
            amountBet:true
        },
        where:{
            gameId
        }
    })
}

async function getTotalBetWonByGameId(gameId: number, score: FinishGame, client: any) {
    return client.bet.aggregate({
        _sum:{
            amountBet:true
        },
        where:{
            gameId,
            homeTeamScore:score.homeTeamScore,
            awayTeamScore:score.awayTeamScore
        }
    })
}

async function setWonBets(gameId: number, score: FinishGame, earnRate: number, client: any) {
    return client.$executeRaw`UPDATE "Bet"
    SET 
      "status" = 'WON',
      "amountWon" = FLOOR("amountBet"*${earnRate})
    WHERE
      "gameId" = ${gameId}
      AND "homeTeamScore" = ${score.homeTeamScore}
      AND "awayTeamScore" = ${score.awayTeamScore};
    `
}

export const betRepository = { createBet, setLostBets, getTotalBetByGameId, getTotalBetWonByGameId, setWonBets }