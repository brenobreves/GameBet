import prisma from "../database";
import { CreateParticipant } from "../protocols";

async function createParticipant(participant: CreateParticipant) {
    return await prisma.participant.create({
        data: participant
    })
}

async function getParticipants() {
    return await prisma.participant.findMany({})
}

async function getParticipantById(id: number) {
    return await prisma.participant.findFirst({
        where:{
            id
        }
    })
}

async function adjustBalanceById(id:number, newBalance: number, client: any) {
    return await client.participant.update({
        where:{
            id
        },
        data:{
            balance: newBalance
        }
    })
}

async function updateWonBalance(gameId: number, client: any) {
    return await client.$executeRaw`UPDATE "Participant"
    SET
      "balance" = "Participant"."balance" + COALESCE("totalAmountWon", 0)
    FROM (
      SELECT
        "participantId",
        SUM("amountWon") AS "totalAmountWon"
      FROM
        "Bet"
      WHERE
        "gameId"=${gameId}
      GROUP BY
        "participantId"
    ) AS "TotalAmounts"
    WHERE
      "Participant"."id" = "TotalAmounts"."participantId";`
}
export const participantRepository = { createParticipant, getParticipants, getParticipantById, adjustBalanceById, updateWonBalance }