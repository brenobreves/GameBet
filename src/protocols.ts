import { Bet, Game, Participant, PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type ApplicationError = {
    name: string;
    message: string;
  };
  
  export type RequestError = {
    status: number;
    data: object | null;
    statusText: string;
    name: string;
    message: string;
  };

  export type CreateParticipant = Omit<Participant, "id"|"createdAt"|"updatedAt">

  export type CreateGame = Omit<Game , "id"|"createdAt"|"updatedAt"|"homeTeamScore"|"awayTeamScore"|"isFinished">

  export type CreateBet = Omit<Bet, "id"|"createdAt"|"updatedAt"|"status"|"amountWon">

  export type FinishGame = Omit<Game, "id"|"createdAt"|"updatedAt"|"homeTeamName"|"awayTeamName"|"isFinished">

  export type TransactionClient = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">