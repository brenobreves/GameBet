import httpStatus from "http-status";
import { Request, Response } from "express";
import { CreateParticipant } from "../protocols";
import { invalidDataError } from "../errors/invalid-data-erro";
import { participantServices } from "../services/participants-services";

async function createParticipant(req: Request, res: Response) {
    const newParticipant = req.body as CreateParticipant
    newParticipant.balance = Number(newParticipant.balance)
    if(isNaN(newParticipant.balance)) throw invalidDataError("Balance is not a number")
    const create = await participantServices.createParticipant(newParticipant)
    return res.status(httpStatus.OK).send(create)
}

export const participantController = { createParticipant }