import { Router } from "express";

import { validateSchema } from "../middlewares/validation-handler";
import { createGameSchema, finishGameSchema } from "../schemas/games-schema";
import { gameController } from "../controllers/games-controller";

const gamesRouter = Router();

gamesRouter
    .post('/', validateSchema(createGameSchema), gameController.createGame)
    .get('/', gameController.getGames)
    .get('/:id', gameController.getGameWithBets)
    .post('/:id/finish', validateSchema(finishGameSchema), gameController.finishGame)

export default gamesRouter