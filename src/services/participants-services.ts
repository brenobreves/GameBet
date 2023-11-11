import { participantRepository } from "../repositories/participants-repository";
import { invalidDataError } from "../errors/invalid-data-erro";
import { CreateParticipant } from "../protocols";

async function createParticipant(participant: CreateParticipant) {
    if(participant.balance < 1000) throw invalidDataError("Balance must be greater than 1000 cents (R$ 10,00)")
    const create = await participantRepository.createParticipant(participant)
    return create
}

export const participantServices = { createParticipant }