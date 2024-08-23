import BaseError from "./BaseError.js";

class NotFoundError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}

export default NotFoundError;