import { faker } from "@faker-js/faker";
import app from "../../src/app";
import supertest from "supertest";
import httpStatus from "http-status";

import { cleanDb } from "../helpers";
import prisma from "../../src/database";
import { createGame } from "../factories/game-factory";
import { createBetsingleParticipant } from "../factories/bet-factory";

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

describe('GET /games/:id', () => {
    it('should throw a bad request if id params is not a positive integer number',async () => {
        const NaNReq = await server.get('/games/abc')
        const floatReq = await server.get('/games/2.5')
        const negativeReq = await server.get('/games/-1')
        expect(NaNReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(floatReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(negativeReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(NaNReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number\"}")
        expect(floatReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number\"}")
        expect(negativeReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number greater than 0\"}")
    })
    it('should throw a not found error if game with id is not found',async () => {
        const gameId = faker.number.int({min:1, max:100000})
        const req = await server.get(`/games/${gameId}`)
        expect(req.statusCode).toBe(httpStatus.NOT_FOUND)
        expect(req.text).toEqual(`{\"message\":\"Data not found: Game with id: ${gameId}\"}`)
    })
    it('should return the game info with a related bets array on success',async () => {
        const {game, participant, betsArr} = await createBetsingleParticipant(2)
        const gameWithBets = await server.get(`/games/${game.id}`)
        expect(gameWithBets.statusCode).toBe(httpStatus.OK)
        const expectedGame = {
            ...game,
            createdAt: game.createdAt.toISOString(),
            updatedAt: game.updatedAt.toISOString()
        }
        const expectedBetsArr = []
        for(let i = 0 ; i < betsArr.length ; i++){
            expectedBetsArr.push({
                ...betsArr[i],
                createdAt: betsArr[i].createdAt.toISOString(),
                updatedAt: betsArr[i].updatedAt.toISOString()
            })
        }
        expect(gameWithBets.body).toEqual({
            ...expectedGame,
            bets: expectedBetsArr
        })
    })
})

describe('POST /games/:id/finish', () => {
    it('should return a bad request if body doesnt match schema', async () => {
        const gameId = faker.number.int({min:1,max:100})
        const wrongBodyResponse = await server.post(`/games/${gameId}/finish`).send({name:faker.person.fullName(), balance:faker.number.float()});
        const wrongBodyCode = wrongBodyResponse.statusCode
        expect(wrongBodyCode).toBe(httpStatus.BAD_REQUEST);
    })

    it('should throw a bad request if id params is not a positive integer number', async () => {
        const nan = faker.lorem.word()
        const float = faker.number.float({max:100,min:0})
        const homeScore = faker.number.int({max:100,min:0})
        const awayScore = faker.number.int({max:100,min:0})
        const negative = faker.number.int({max:-1, min:-100})
        const NaNReq = await server.post(`/games/${nan}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        const floatReq = await server.post(`/games/${float}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        const negativeReq = await server.post(`/games/${negative}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        expect(NaNReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(floatReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(negativeReq.statusCode).toBe(httpStatus.BAD_REQUEST)
        expect(NaNReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number\"}")
        expect(floatReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number\"}")
        expect(negativeReq.text).toEqual("{\"message\":\"Invalid data: id params must be a integer number greater than 0\"}")
    })

    it('should throw a not found if game is not foud with provided id via params', async () => {
        const homeScore = faker.number.int({max:100,min:0})
        const awayScore = faker.number.int({max:100,min:0})
        const randomId = faker.number.int({max:100,min:0})
        const noGameReq = await server.post(`/games/${randomId}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        expect(noGameReq.statusCode).toBe(httpStatus.NOT_FOUND)
        expect(noGameReq.text).toEqual(`{\"message\":\"Data not found: Game with id: ${randomId}\"}`)
    })

    it('should throw a forbidden error if game is already over', async () => {
        const homeScore = faker.number.int({max:100,min:0})
        const awayScore = faker.number.int({max:100,min:0})
        const game = await createGame(true)
        const gameOverReq = await server.post(`/games/${game.id}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        expect(gameOverReq.statusCode).toBe(httpStatus.FORBIDDEN)
        expect(gameOverReq.text).toEqual(`{\"message\":\"Forbidden action: Game with id: ${game.id} is already over\"}`)
    })

    it('if everything is ok should set isFinished to true', async () => {
        const homeScore = faker.number.int({max:100,min:0})
        const awayScore = faker.number.int({max:100,min:0})
        const game = await createGame()
        const okGame = await server.post(`/games/${game.id}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        expect(okGame.statusCode).toBe(httpStatus.OK)

        const expectedBody = {
            ...game,
            homeTeamScore: homeScore,
            awayTeamScore: awayScore,
            isFinished:true,
            createdAt: game.createdAt.toISOString(),
            updatedAt:game.updatedAt.toISOString()

        }
        expect(okGame.body).toEqual(expectedBody)

        const gameCheck = await prisma.game.findFirst({
            where:{
                id:game.id
            }
        })

        expect(gameCheck.isFinished).toBe(true)
    })

    it('after closing games no bet related should be pending', async () => {
        const homeScore = faker.number.int({max:100,min:0})
        const awayScore = faker.number.int({max:100,min:0})
        const { game } = await createBetsingleParticipant(3)
        const okGame = await server.post(`/games/${game.id}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        const pendingBets = await prisma.bet.findMany({
            where:{
                gameId:game.id,
                status:"PENDING"
            }
        })
        expect(pendingBets).toHaveLength(0)
    })

    it('should set the corret status and amountWon to bets', async () => {
        const { game, participant, betsArr } = await createBetsingleParticipant(3)
        const homeScore = betsArr[0].homeTeamScore
        const awayScore = betsArr[0].awayTeamScore
        const okGame = await server.post(`/games/${game.id}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        const lostBetCheck = await prisma.bet.findMany({
            where:{
                gameId: game.id,
                OR: [
                  { homeTeamScore: { not: homeScore } },
                  { awayTeamScore: { not: awayScore } },
                ]
              }
        })
        for(let  i = 0 ; i < lostBetCheck.length ; i++){
            expect(lostBetCheck[i].status).toBe("LOST")
            expect(lostBetCheck[i].amountWon).toBe(0)
        }
        const wonBetCheck = await prisma.bet.findMany({
            where:{
                gameId: game.id,
                AND: [
                  { homeTeamScore:homeScore},
                  { awayTeamScore:awayScore},
                ]
              }
        })
        for(let  i = 0 ; i < wonBetCheck.length ; i++){
            expect(wonBetCheck[i].status).toBe("WON")
            expect(wonBetCheck[i].amountWon).toBeGreaterThan(0)
        }
    })
    it('should update winning participants balance',async () => {
        const { game, participant, betsArr } = await createBetsingleParticipant(3)
        const homeScore = betsArr[0].homeTeamScore
        const awayScore = betsArr[0].awayTeamScore
        const okGame = await server.post(`/games/${game.id}/finish`).send({homeTeamScore: homeScore, awayTeamScore: awayScore})
        const afterGame = await prisma.participant.findFirst({
            where:{
                id:participant.id
            }
        })
        // factories create bets with no cost to balance, by forcing at least a winning bet, the participant should have its balance increased
        expect(afterGame.balance).toBeGreaterThan(participant.balance)
    })
})