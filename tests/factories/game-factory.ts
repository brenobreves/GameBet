import prisma from "../../src/database";
import { faker } from "@faker-js/faker"

export async function createGame() {
    return prisma.game.create({
        data:{
            homeTeamName: faker.company.name(),
            awayTeamName: faker.company.name()
        }
    })
}