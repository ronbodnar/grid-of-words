import BaseError from "./BaseError.js";

class ValidationError extends BaseError {
    constructor(message, data) {
        super("ValidationError", 400, message, data);
    }
}

export default ValidationError;