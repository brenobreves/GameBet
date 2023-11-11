import { faker } from "@faker-js/faker";
import app from "../../src/app";
import supertest from "supertest"
import { cleanDb } from "../helpers";
import httpStatus from "http-status";

const server = supertest(app)

beforeEach(async () => {
    await cleanDb();
})

describe('POST /participants', () => {
    it('should return a bad request with an empty body', async () => {
        const response = await server.post("/participants").send({});
        const {statusCode} = response;
        expect(statusCode).toBe(httpStatus.BAD_REQUEST);
    })

    it('should return a bad request if body doesnt match schema', async () => {
        const notIntBalanceResponse = server.post("/participants").send({name:faker.person.fullName(), balance:faker.number.float()});
        const notIntBalanceCode = (await notIntBalanceResponse).statusCode
        expect(notIntBalanceCode).toBe(httpStatus.BAD_REQUEST);
    })

    describe("If body is OK", () => {
        it('should return a bad request if balance is under R$10,00 (1000 cents)', async () => {
            const lowBalanceResponse = server.post("/participants").send({name:faker.person.fullName(), balance:faker.number.int({max:999})});
            const lowBalanceCode = (await lowBalanceResponse).statusCode
            const lowBalanceText = (await lowBalanceResponse).text
            expect(lowBalanceCode).toBe(httpStatus.BAD_REQUEST)
            expect(lowBalanceText).toBe("{\"message\":\"Invalid data: Balance must be greater than 1000 cents (R$ 10,00)\"}")
        })
        it('should create a participant when everything is OK', async () => {
            const newParticipantReq = await server.post('/participants').send({name:faker.person.fullName(), balance:faker.number.int({min:1000, max:10000})})
            const newParticipantCode = newParticipantReq.statusCode
            expect(newParticipantCode).toBe(httpStatus.CREATED)
            expect(newParticipantReq.body).toEqual({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                name: expect.any(String),
                balance: expect.any(Number)
            })
        })
    })

})