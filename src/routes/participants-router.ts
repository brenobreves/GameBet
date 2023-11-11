import { Router } from "express";

import { validateBody } from "@/middlewares";
import { createParticipantSchema } from "@/schemas";
import { ParticipantController } from "@/controllers";

const participantRouter = Router();

participantRouter
    .post('/', validateBody(createParticipantSchema), ParticipantController.createParticipant)


export {participantRouter};