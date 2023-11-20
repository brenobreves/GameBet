import { CreateBet, FinishGame, TransactionClient } from "../protocols";

async function createBet(bet: CreateBet, client:TransactionClient) {
    return await client.bet.create({
        data: bet
    })
}

async function setLostBets(gameId: number, score: FinishGame, client:TransactionClient) {
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

async function getTotalBetByGameId(gameId: number, client:TransactionClient) {
    return client.bet.aggregate({
        _sum:{
            amountBet:true
        },
        where:{
            gameId
        }
    })
}

async function getTotalBetWonByGameId(gameId: number, score: FinishGame, client:TransactionClient) {
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

async function setWonBets(filter:{gameId: number;score: FinishGame;}, earnRate: number, client:TransactionClient) {
    return client.$executeRaw`UPDATE "Bet"
    SET 
      "status" = 'WON',
      "amountWon" = FLOOR("amountBet"*${earnRate})
    WHERE
      "gameId" = ${filter.gameId}
      AND "homeTeamScore" = ${filter.score.homeTeamScore}
      AND "awayTeamScore" = ${filter.score.awayTeamScore};
    `
}

export const betRepository = { createBet, setLostBets, getTotalBetByGameId, getTotalBetWonByGameId, setWonBets }