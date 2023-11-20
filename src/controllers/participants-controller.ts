import httpStatus from "http-status";
import { Request, Response } from "express";

import { CreateParticipant } from "../protocols";
import { participantServices } from "../services/participants-services";

async function createParticipant(req: Request, res: Response) {
    const newParticipant = req.body as CreateParticipant
    newParticipant.balance = Number(newParticipant.balance)
    const create = await participantServices.createParticipant(newParticipant)
    return res.status(httpStatus.CREATED).send(create)
}

async function getParticipants(req: Request, res: Response) {
    const participantList = await participantServices.getParticipants()
    return res.status(httpStatus.OK).send(participantList)
}

export const participantController = { createParticipant, getParticipants }