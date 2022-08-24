import BaseError from "./BaseError.js";

class InternalError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}

export default InternalError;