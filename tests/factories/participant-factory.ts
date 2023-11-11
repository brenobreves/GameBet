import prisma from "../../src/database";
import { faker } from "@faker-js/faker"

export async function createParticipant(balance?: number) {
    return prisma.participant.create({
        data:{
            name: faker.person.fullName(),
            balance: balance || faker.number.int({min:1000, max:10000})
        }
    })
}