import { CreateParticipant } from "@/protocols";
import { ParticipantRepository } from "@/repositories";

 async function createParticipant(participant: CreateParticipant){
    return await ParticipantRepository.createParticipant(participant)
 }

 export const ParticipantService = { createParticipant }