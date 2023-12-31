import Joi from "joi";

import { CreateParticipant } from "../protocols";

export const createParticipantSchema = Joi.object<CreateParticipant>({
    name: Joi.string().required(),
    balance: Joi.number().integer().required(),
})