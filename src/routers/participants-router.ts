import { Router } from "express";

import { participantController } from "../controllers/participants-controller";
import { validateSchema } from "../middlewares/validation-handler";
import { createParticipantSchema } from "../schemas/participant-schema";

const participantRouter = Router();

participantRouter
    .post('/', validateSchema(createParticipantSchema), participantController.createParticipant)
    .get('/', participantController.getParticipants)

export default participantRouter