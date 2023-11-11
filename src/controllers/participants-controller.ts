import { CreateParticipant } from "@/protocols";
import { ParticipantService } from "@/services/participants-service";
import { Response, Request } from "express";
import httpStatus from "http-status";

async function createParticipant(req: Request, res: Response) {
    const newParticipant = req.body as CreateParticipant
    newParticipant.balance = Number(newParticipant.balance)
    const create = await ParticipantService.createParticipant(newParticipant)
    return res.status(httpStatus.CREATED).send(create)
}

export const ParticipantController = { createParticipant }
