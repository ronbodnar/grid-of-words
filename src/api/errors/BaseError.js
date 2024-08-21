export class BaseError extends Error {
    constructor(message, data) {
        super(message);
        if (typeof data === "object") {
            this.data = JSON.stringify(data);
        } else {
            this.data = data;
        }
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}