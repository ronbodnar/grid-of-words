import BaseError from "./BaseError.js";

class DatabaseError extends BaseError {
  constructor(message, data) {
    super(message, data);
  }
}

export default DatabaseError;
