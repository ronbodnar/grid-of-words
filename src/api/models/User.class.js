import { generateSalt, hashPassword } from "../services/authentication.service.js";

export class User {

    id = undefined;
    username = undefined;
    #hash = undefined;
    #salt = undefined;
    email = undefined;
    enabled = undefined;
    creationDate = undefined;

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.salt = generateSalt();
        this.hash = hashPassword(password, this.salt);
        this.enabled = true;
        this.creationDate = new Date();
    }

}