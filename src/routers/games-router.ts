import { Router } from "express";

import { validateSchema } from "../middlewares/validation-handler";
import { createGameSchema } from "../schemas/games-schema";
import { gameController } from "../controllers/games-controller";

const gamesRouter = Router();

gamesRouter
    .post('/', validateSchema(createGameSchema), gameController.createGame)
    .get('/', gameController.getGames)

export default gamesRouter