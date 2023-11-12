import { Router } from "express";

import { validateSchema } from "../middlewares/validation-handler";
import { createBetSchema } from "../schemas/bets-schema";
import { betController } from "../controllers/bets-controller";

const betsRouter = Router();

betsRouter
    .post('/', validateSchema(createBetSchema), betController.createBet)

export default betsRouter