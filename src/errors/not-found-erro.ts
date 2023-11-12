import { ApplicationError } from "protocols";

export function NotFoundError(details: string): ApplicationError {
  return {
    name: 'NotFoundError',
    message: `Data not found: ${details}`,
  };
}