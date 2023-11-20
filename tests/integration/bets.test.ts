import { faker } from "@faker-js/faker";
import app from "../../src/app";
import supertest from "supertest";
import httpStatus from "http-status";

import { cleanDb } from "../helpers";
import prisma from "../../src/database";
import { createParticipant } from "../factories/participant-factory";
import { createGame } from "../factories/game-factory";

const server = supertest(app)

beforeEach(async () => {
    await cleanDb();
})

describe('POST /bets', () => {
    it('should return a bad request with an empty body', async () => {
        const response = await server.post("/bets").send({});
        const {statusCode} = response;
        expect(statusCode).toBe(httpStatus.BAD_REQUEST);
    })

    it('should return a bad request if body doesnt match schema', async () => {
        const wrongBodyResponse = await server.post("/bets").send(
            {
            homeTeamScore:faker.animal.bear(),
            awayTeamScore:faker.airline.aircraftType(),
            amountBet:faker.color.human(),
            gameId:faker.company.catchPhrase(),
            participantId:faker.number.float()
            });
        const wrongBodyCode = wrongBodyResponse.statusCode
        expect(wrongBodyCode).toBe(httpStatus.BAD_REQUEST);
    })

    it('should return a bad request if bet isnt greater than 0', async () => {
        const wrongBodyResponse = await server.post("/bets").send(
            {
            homeTeamScore:faker.animal.bear(),
            awayTeamScore:faker.airline.aircraftType(),
            amountBet:faker.number.int({min:-100,max:0}),
            gameId:faker.number.int({min:1,max:100}),
            participantId:faker.number.int({min:1,max:100})
            });
        const wrongBodyCode = wrongBodyResponse.statusCode
        expect(wrongBodyCode).toBe(httpStatus.BAD_REQUEST);
    })

    describe("If body is OK", () => {
        it('should return a not found if participant doesnt exist', async () => {           
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:1,max:100}),
                gameId: faker.number.int({min:1,max:100}),
                participantId:faker.number.int({min:0,max:100})
                } 
            const noPartResponse = await server.post('/bets').send(bet)
                
            const noPartCode = noPartResponse.statusCode
            expect(noPartCode).toBe(httpStatus.NOT_FOUND)
            const message = noPartResponse.text
            expect(message).toEqual(`{\"message\":\"Data not found: Participant with id: ${bet.participantId}\"}`)
        })
        it('should return a bad request if balance is smaller than bet',async () => {
            const participant = await createParticipant(10000)
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:10001,max:100000}),
                gameId: faker.number.int({min:1,max:100}),
                participantId: participant.id
                }
            const noBalResponse = await server.post('/bets').send(bet) 

            const noBalCode = noBalResponse.statusCode
            expect(noBalCode).toBe(httpStatus.BAD_REQUEST)
            const message = noBalResponse.text
            expect(message).toEqual(`{\"message\":\"Invalid data: Your funds must be greater or equal to the amount bet, your funds: ${participant.balance} amount bet: ${bet.amountBet}\"}`)
        })
        it('should return a not found if game doesnt exist', async () => {    
            const participant = await createParticipant(10000)       
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:1,max:participant.balance}),
                gameId: faker.number.int({min:1,max:100}),
                participantId: participant.id
                }
            const noGameResponse = await server.post('/bets').send(bet)
                
            const noGameCode = noGameResponse.statusCode
            expect(noGameCode).toBe(httpStatus.NOT_FOUND)
            const message = noGameResponse.text
            expect(message).toEqual(`{\"message\":\"Data not found: Game with id: ${bet.gameId}\"}`)
        })
        it('should return a bad request if game is already over', async () => {    
            const participant = await createParticipant(10000)   
            const game = await createGame(true)    
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:1,max:participant.balance}),
                gameId: game.id,
                participantId: participant.id
                }
            const gameOverResponse = await server.post('/bets').send(bet)
                
            const gameOverCode = gameOverResponse.statusCode
            expect(gameOverCode).toBe(httpStatus.BAD_REQUEST)
            const message = gameOverResponse.text
            expect(message).toEqual(`{\"message\":\"Invalid data: Game is already over\"}`)
        })

        it('should decrease participant balance on success',async () => {
            const participant = await createParticipant(10000)   
            const game = await createGame()
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:1,max:participant.balance}),
                gameId: game.id,
                participantId: participant.id
                }
            const newBetResponse = await server.post('/bets').send(bet)
            const partAfterBet = await prisma.participant.findFirst({
                where:{
                    id:participant.id
                }
            })
            expect(partAfterBet.balance).toBe(participant.balance-bet.amountBet)
        })

        it('should create and return the bet infos if everything is OK',async () => {
            const participant = await createParticipant(10000)   
            const game = await createGame()
            const bet = {
                homeTeamScore:faker.number.int({min:0,max:100}),
                awayTeamScore:faker.number.int({min:0,max:100}),
                amountBet:faker.number.int({min:1,max:participant.balance}),
                gameId: game.id,
                participantId: participant.id
                }
            const newBetResponse = await server.post('/bets').send(bet)
            const newBetCode = newBetResponse.statusCode
            expect(newBetCode).toBe(httpStatus.CREATED)
            expect(newBetResponse.body).toEqual({
                ...bet,
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                status: "PENDING",
                amountWon: null
            })
        })
    })
})