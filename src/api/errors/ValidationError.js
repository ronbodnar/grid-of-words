import BaseError from "./BaseError.js";

class ValidationError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}

export default ValidationError;