import prisma from "../../src/database";
import { faker } from "@faker-js/faker"

export async function createGame(isFinished?: boolean) {
    return prisma.game.create({
        data:{
            homeTeamName: faker.animal.bear(),
            awayTeamName: faker.animal.bird(),
            isFinished: (false || isFinished)
        }
    })
}