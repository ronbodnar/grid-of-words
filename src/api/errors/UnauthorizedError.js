import BaseError from "./BaseError.js";

export class UnauthorizedError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}