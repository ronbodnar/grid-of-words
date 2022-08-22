export class NotFoundError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data || undefined;
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}