import UserStats from "./UserStats.js";
import { generateSalt, hashPassword } from "../auth/authentication.service.js";
import { updateUser, insertUser } from "./user.repository.js"; // eslint-disable-line no-unused-vars
import InternalError from "../../errors/InternalError.js";

class User {
  // Account Details
  _id = undefined;
  hash = undefined;
  email = undefined;
  username = undefined;
  password = undefined;
  lastGameState = undefined;

  statistics = undefined;
  passwordResetToken = undefined;
  passwordResetTokenExpiration = undefined;

  // These properties are written to all User documents by default.
  // Undefined and null values are ignored when updating documents.
  enabled = true;
  creationDate = new Date();

  // To be implemented eventually
  lastConnectionIP = undefined;
  lastConnectionTimestamp = undefined;
  consecutiveDaysPlayed = undefined;
  bestConsecutiveDaysPlayed = undefined;

  /**
   * Initializes a new instance of the class with the given `userData` object.
   *
   * @param {Object} userData - The user data used to initialize the User object.
   * @param {string} [userData._id] - The unique identifier for the user.
   * @param {string} [userData.hash] - The hashed password, including the salt.
   * @param {string} [userData.email] - The user's email address.
   * @param {string} [userData.username] - The user's username.
   * @param {string} [userData.password] - The plain text password (only used during registration).
   * @param {boolean} [userData.enabled=true] - Whether the user's account is enabled.
   * @param {Date|string} [userData.creationDate] - The date when the user account was created.
   * @param {Object} [userData.statistics] - The user's statistics object, used to initialize a UserStats instance.
   * @param {string} [userData.passwordResetToken] - The token used for resetting the user's password.
   * @param {Date|string} [userData.passwordResetTokenExpiration] - The expiration date of the password reset token.
   *
   * @throws {InternalError} If userData is not an object or if required fields are missing.
   */
  constructor(userData) {
    if (!userData || typeof userData !== "object") {
      throw new InternalError("userData must be an object");
    }

    const {
      _id,
      hash,
      email,
      username,
      password,
      enabled,
      creationDate,
      statistics,
      passwordResetToken,
      passwordResetTokenExpiration,
    } = userData;

    // Register service creates a new user with a password, nowhere else is it used to instantiate the user.
    if (password) {
      const salt = generateSalt();

      this.email = email;
      this.username = username;
      this.hash = salt + hashPassword(password, salt);
      return;
    }

    // Handling of a standard userData object
    if (!_id) {
      throw new InternalError("User ID is required");
    }
    this._id = _id;
    this.hash = hash;
    this.username = username;
    this.email = email;
    this.enabled = enabled === true;
    this.creationDate = new Date(creationDate);
    this.statistics = (statistics && new UserStats(statistics)) || this.statistics;
    this.passwordResetToken = passwordResetToken;
    this.passwordResetTokenExpiration = passwordResetTokenExpiration;
  }

  /**
   * Invokes {@link updateUser} with this User instance and the `properties` object.
   * 
   * @async
   * @param {Object} [properties={}] An object with properties to save to the user document.
   * @returns {Promise<User|null>} A promise that resolves when {@link updateUser} is resolved..
   */
  async save(properties) {
    return updateUser(this, properties);
  }

  /**
   * Obtains the salt for the user.
   * 
   * @returns {string} The salt for the hashed password.
   */
  getSalt() {
    return this.hash.substring(0, 32);
  }

  /**
   * Obtains the hashed password for the user.
   * 
   * @returns {string} The hashed password
   */
  getHash() {
    return this.hash.substring(32);
  }

  /**
   * Used to ignore undefined values to avoid unnecessary data in documents. See {@link insertUser}
   * 
   * @returns {Object} A copy of the user object with undefined values removed.
   */
  getWithoutUndefined() {
    return Object.fromEntries(
      Object.entries(this).filter(([key, value]) => value !== undefined)
    );
  }

  /**
   * Export basic account information in the form of an object for JWT generation.
   *
   * @returns {Object} The account details for the JWT payload.
   */
  getAccountDetails() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      enabled: this.enabled,
      creationDate: this.creationDate.toISOString(),
    };
  }
}

export default User;
