import { Participant } from "@prisma/client";

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