import BaseError from "./BaseError.js";

class NotFoundError extends BaseError {
  constructor(message, data) {
    super("NotFoundError", 404, message, data);
  }
}

export default NotFoundError;
