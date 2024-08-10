import { saveUser } from "../repository/user.repository.js";
import {
  generateSalt,
  hashPassword,
} from "../services/authentication.service.js";

export class User {
  id = undefined;
  username = undefined;
  hash = undefined;
  email = undefined;
  enabled = undefined;
  creationDate = undefined;

  constructor(email, username, password) {
    if (!email) return this;
    const salt = generateSalt();
    this.email = email;
    this.username = username;
    this.hash = salt + hashPassword(password, salt);
    this.enabled = true;
    this.creationDate = new Date();
  }

  fromJSON(json) {
    if (json === undefined) return null;
    console.log("fromJSON", json);
    this.id = json.id;
    this.username = json.username;
    this.hash = json.hash;
    this.email = json.email;
    this.enabled = json.enabled;
    this.creationDate = json.creationDate;
    return this;
  }

  async save(properties) {
    properties = properties || [];

    return saveUser(this, properties);
  }

  getSalt() {
    return this.hash.substring(0, 32);
  }

  getHash() {
    return this.hash.substring(32);
  }
}
