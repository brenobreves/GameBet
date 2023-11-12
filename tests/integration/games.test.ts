import { faker } from "@faker-js/faker";
import app from "../../src/app";
import supertest from "supertest";
import httpStatus from "http-status";

import { cleanDb } from "../helpers";
import prisma from "../../src/database";
import { createGame } from "../factories/game-factory";

const server = supertest(app)

beforeEach(async () => {
    await cleanDb();
})

describe('POST /games', () => {
    it('should return a bad request with an empty body', async () => {
        const response = await server.post("/games").send({});
        const {statusCode} = response;
        expect(statusCode).toBe(httpStatus.BAD_REQUEST);
    })

    it('should return a bad request if body doesnt match schema', async () => {
        const wrongBodyResponse = server.post("/games").send({name:faker.person.fullName(), balance:faker.number.float()});
        const wrongBodyCode = (await wrongBodyResponse).statusCode
        expect(wrongBodyCode).toBe(httpStatus.BAD_REQUEST);
    })

    describe("If body is OK", () => {
        it('should return a bad request if a team name is numeric', async () => {
            const name1 = faker.number.int({max:1000})
            const name2 = faker.company.name()
            const numericNameResponse = server.post("/games").send({homeTeamName:`${name1}`, awayTeamName: name2});
            const numericNameCode = (await numericNameResponse).statusCode
            const numericNameText = (await numericNameResponse).text
            expect(numericNameCode).toBe(httpStatus.BAD_REQUEST)
            expect(numericNameText).toBe(`{\"message\":\"Invalid data: Teams names shouldn't be numbers, homeTeam: ${name1} awayTeam: ${name2}\"}`)
        })
        it('should create a game when everything is OK', async () => {
            const newGameReq = await server.post('/games').send({homeTeamName:faker.animal.bird(), awayTeamName:faker.animal.bear()})
            const newGameCode = newGameReq.statusCode
            expect(newGameCode).toBe(httpStatus.CREATED)
            expect(newGameReq.body).toEqual({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamName: expect.any(String),
                awayTeamName: expect.any(String),
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false
            })

            const gameCheck = await prisma.game.findFirst({
                where:{
                    id: newGameReq.body.id
                }
            })
            const gameExpected = {
                ...gameCheck,
                createdAt: gameCheck.createdAt.toISOString(),
                updatedAt: gameCheck.updatedAt.toISOString()
            }
            expect(gameExpected).toEqual(newGameReq.body)
        })
    })
})

describe('GET /games', () => {
    it('should return all games', async () => {
        const game1 = await createGame()
        const game2 = await createGame()
        const gamesList = await server.get('/games')
        const expectedGame1 = {
            ...game1,
            createdAt: game1.createdAt.toISOString(),
            updatedAt: game1.updatedAt.toISOString()
        }
        const expectedGame2 = {
            ...game2,
            createdAt: game2.createdAt.toISOString(),
            updatedAt: game2.updatedAt.toISOString()
        }
        expect(gamesList.body).toEqual([expectedGame1,expectedGame2])
        expect(gamesList.statusCode).toBe(httpStatus.OK)
    })
})