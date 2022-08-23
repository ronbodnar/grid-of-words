import BaseError from "./BaseError.js";

export class InternalError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}