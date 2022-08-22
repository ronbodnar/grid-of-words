export class DatabaseError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data || undefined;
        this.name = "DatabaseError";
        this.statusCode = 500;
    }
}