import prisma from "../../src/database";
import { faker } from "@faker-js/faker"
import { createGame } from "./game-factory";
import { createParticipant } from "./participant-factory";
import { Bet } from "@prisma/client";

export async function createBetsingleParticipant(betNum = 1) {
    const game = await createGame()
    const participant = await createParticipant(10000)
    const betsArr: Array<Bet> = []
    for(let i = 0 ; i < betNum ; i++){
        let newBet = await prisma.bet.create({
            data:{
                amountBet: 1,
                gameId: game.id,
                participantId: participant.id,
                homeTeamScore: faker.number.int({min:0,max:100}),
                awayTeamScore: faker.number.int({min:0,max:100})
            }
        })
        betsArr.push(newBet)
    }
    return {game , participant , betsArr}
}