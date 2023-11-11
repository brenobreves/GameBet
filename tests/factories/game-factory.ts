import prisma from "../../src/database";
import { faker } from "@faker-js/faker"

export async function createGame() {
    return prisma.game.create({
        data:{
            homeTeamName: faker.animal.bear(),
            awayTeamName: faker.animal.bird()
        }
    })
}