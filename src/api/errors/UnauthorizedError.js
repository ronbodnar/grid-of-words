export class UnauthorizedError extends Error {
    constructor(message, data) {
        super(message);
        if (typeof data === "object") {
            this.data = JSON.stringify(data);
        } else {
            this.data = data;
        }
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}