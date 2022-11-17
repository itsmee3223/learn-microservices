import { CustomError } from "./customError";

export class NotAuthorizedError extends CustomError {
  statusCode = 400;

  constructor() {
    super("Not authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
