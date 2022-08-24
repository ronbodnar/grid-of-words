import BaseError from "./BaseError.js";

class UnauthorizedError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}

export default UnauthorizedError;