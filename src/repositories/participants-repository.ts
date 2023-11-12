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

async function adjustBalanceById(id:number, newBalance: number) {
    return prisma.participant.update({
        where:{
            id
        },
        data:{
            balance: newBalance
        }
    })
}
export const participantRepository = { createParticipant, getParticipants, getParticipantById, adjustBalanceById }