export class InternalError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data || undefined;
        this.name = "InternalError";
        this.statusCode = 500;
    }
}