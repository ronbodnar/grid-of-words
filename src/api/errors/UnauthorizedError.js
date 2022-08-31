import BaseError from "./BaseError.js";

class UnauthorizedError extends BaseError {
  constructor(message, data) {
    super("UnauthorizedError", 401, message, data);
  }
}

export default UnauthorizedError;
