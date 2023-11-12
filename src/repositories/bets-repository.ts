import prisma from "../database";
import { CreateBet } from "../protocols";

async function createBet(bet: CreateBet) {
    return await prisma.bet.create({
        data: bet
    })
}

export const betRepository = { createBet }