import { Bet, Game, Participant } from "@prisma/client";

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