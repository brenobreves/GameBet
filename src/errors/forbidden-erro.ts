import { ApplicationError } from "protocols";

export function ForbiddenError(details: string): ApplicationError {
  return {
    name: 'Forbidden',
    message: `Forbidden action: ${details}`,
  };
}