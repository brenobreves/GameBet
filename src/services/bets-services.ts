import { participantRepository } from "../repositories/participants-repository";
import { CreateBet, TransactionClient } from "../protocols";
import { invalidDataError } from "../errors/invalid-data-erro";
import { gameRepository } from "../repositories/games-repository";
import prisma from "../database";
import { betRepository } from "../repositories/bets-repository";
import { NotFoundError } from "../errors/not-found-erro";

async function createBet(bet: CreateBet) {
    const participant = await participantRepository.getParticipantById(bet.participantId)
    if(!participant) throw NotFoundError(`Participant with id: ${bet.participantId}`)
    const saldo = participant.balance
    if(bet.amountBet > saldo) throw invalidDataError("Your funds must be greater or equal to the amount bet, "+`your funds: ${saldo} amount bet: ${bet.amountBet}`)
    const game = await gameRepository.getGameById(bet.gameId)
    if(!game) throw NotFoundError(`Game with id: ${bet.gameId}`)
    if(game.isFinished) throw invalidDataError("Game is already over")
    const newBalance = saldo - bet.amountBet
    let returnBet:any = {}
    await prisma.$transaction(async (tx:TransactionClient) =>{
        const createBet = await betRepository.createBet(bet, tx)
        const adjustBalance = await participantRepository.adjustBalanceById(bet.participantId, newBalance, tx)
        returnBet = createBet
    })
    return returnBet
}   

export const betServices = { createBet }