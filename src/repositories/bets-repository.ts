import prisma from "../database";
import { CreateBet } from "../protocols";

async function createBet(bet: CreateBet, client?) {
    if(!client) client = prisma
    return await client.bet.create({
        data: bet
    })
}

export const betRepository = { createBet }