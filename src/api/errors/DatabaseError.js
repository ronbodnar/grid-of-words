import BaseError from "./BaseError.js"

class DatabaseError extends BaseError {
  constructor(message, data) {
    super("DatabaseError", 500, message, data)
  }
}

export default DatabaseError
