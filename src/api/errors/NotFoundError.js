import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
    constructor(message, data) {
        super(message, data);
    }
}