import Joi from "joi";

import { CreateGame, FinishGame } from "../protocols";

export const createGameSchema = Joi.object<CreateGame>({
    homeTeamName: Joi.string().required(),
    awayTeamName: Joi.string().required()
})

export const finishGameSchema = Joi.object<FinishGame>({
    homeTeamScore: Joi.number().min(0).integer().required(),
    awayTeamScore: Joi.number().min(0).integer().required()
})