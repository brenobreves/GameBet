import Joi from "joi";

import { CreateBet } from "../protocols";

export const createBetSchema = Joi.object<CreateBet>({
    homeTeamScore: Joi.number().integer().min(0).required(),
    awayTeamScore: Joi.number().integer().min(0).required(),
    amountBet: Joi.number().integer().min(1).required(),
    gameId: Joi.number().integer().min(0).required(),
    participantId: Joi.number().integer().min(0).required()
})