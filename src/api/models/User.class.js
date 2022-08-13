import { saveUser } from "../repository/user.repository.js";
import {
  generateSalt,
  hashPassword,
} from "../services/authentication.service.js";
import { Buffer } from "node:buffer";

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
    this.id = Buffer.from(json.id);
    this.username = json.username;
    this.hash = json.hash;
    this.email = json.email;
    this.enabled = json.enabled;
    this.creationDate = json.creationDate;
    if (json.passwordResetToken)
      this.passwordResetToken = json.passwordResetToken;
    if (json.passwordResetTokenExpiration)
      this.passwordResetTokenExpiration = json.passwordResetTokenExpiration;
    return this;
  }

  async save(properties) {
    properties = properties || [];
    
    // If just one property was passed, convert it to an array.
    if (!Array.isArray(properties)) {
      properties = [properties]
    }

    return saveUser(this, properties);
  }

  getUUID() {
    return this.id.toString();
  }

  getSalt() {
    return this.hash.substring(0, 32);
  }

  getHash() {
    return this.hash.substring(32);
  }
}
