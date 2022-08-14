export class UnauthorizedError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data || undefined;
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}