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

export const participantRepository = { createParticipant, getParticipants }