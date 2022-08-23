import BaseError from "./BaseError.js";

export class DatabaseError extends BaseError {
  constructor(message, data) {
    super(message, data);
  }
}
