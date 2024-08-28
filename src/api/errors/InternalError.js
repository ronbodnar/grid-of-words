import BaseError from "./BaseError.js";

class InternalError extends BaseError {
    constructor(message, data) {
        super("InternalError", 500, message, data);
    }
}

export default InternalError;