export class ValidationError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data || undefined;
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}