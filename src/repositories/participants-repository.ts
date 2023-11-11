import { prisma } from "@/config";
import { CreateParticipant } from "@/protocols";

async function createParticipant(participant: CreateParticipant) {
    return await prisma.participant.create({
        data:participant
    })
}

export const ParticipantRepository = { createParticipant }