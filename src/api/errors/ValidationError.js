import BaseError from "./BaseError.js";

export class ValidationError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}