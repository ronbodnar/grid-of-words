import ValidationError from "../../errors/ValidationError.js";
import { generateSalt, hashPassword } from "../auth/authentication.service.js";
import GameState from "../game/GameState.js";
import UserStats from "./UserStats.js";
import { updateUser, insertUser } from "./user.repository.js";

class User {
  // Account Details
  _id = undefined;
  hash = undefined;
  email = undefined;
  username = undefined;
  password = undefined;
  lastGameState = undefined;
  lastConnectionIP = undefined;
  lastConnectionTimestamp = undefined;

  
  stats = undefined;
  passwordResetToken = undefined;
  passwordResetTokenExpiration = undefined;

  // These properties are written to all User documents by default.
  // Undefined and null values are ignored when updating documents.
  enabled = true;
  creationDate = new Date();

  /**
   * User class constructor that handles user data initialization.
   *
   * @param {Object} userData - The user data used to initialize the User object.
   * @param {string} [userData._id] - The unique identifier for the user.
   * @param {string} [userData.hash] - The hashed password, including the salt.
   * @param {string} [userData.email] - The user's email address.
   * @param {string} [userData.username] - The user's username.
   * @param {string} [userData.password] - The plain text password (only used during registration).
   * @param {boolean} [userData.enabled=true] - Whether the user's account is enabled.
   * @param {Date|string} [userData.creationDate] - The date when the user account was created.
   * @param {Object} [userData.stats] - The user's statistics object, used to initialize a UserStats instance.
   * @param {string} [userData.passwordResetToken] - The token used for resetting the user's password.
   * @param {Date|string} [userData.passwordResetTokenExpiration] - The expiration date of the password reset token.
   *
   * @throws {ValidationError} If userData is not an object or if required fields are missing.
   */
  constructor(userData) {
    if (!userData || typeof userData !== "object") {
      throw new ValidationError("userData must be an object");
    }

    const {
      _id,
      hash,
      email,
      username,
      password,
      enabled,
      creationDate,
      stats,
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
      throw new ValidationError("User ID is required");
    }
    this._id = _id;
    this.hash = hash;
    this.username = username;
    this.email = email;
    this.enabled = enabled === true;
    this.creationDate = new Date(creationDate);
    this.stats = new UserStats(stats) || this.stats;
    this.passwordResetToken = passwordResetToken;
    this.passwordResetTokenExpiration = passwordResetTokenExpiration;
  }

  async updateStats(numAttempts, finalGameState) {
    if (!this.stats) {
      this.stats = new UserStats();
    }

    const isWinner = finalGameState === GameState.WINNER;
    const isAbandoned = finalGameState === GameState.ABANDONED;

    this.stats.totalGames += 1;
    this.stats.wins[numAttempts] += isWinner ? 1 : 0;
    this.stats.losses += isWinner ? 0 : 1;
    this.stats.abandoned += isAbandoned ? 1 : 0;

    if (isWinner) {
      this.stats.winStreak += 1;
      if (this.stats.bestWinStreak < this.stats.winStreak) {
        this.stats.bestWinStreak = this.stats.winStreak;
      }
    } else {
      this.stats.winStreak = 0;
    }

    const userSavedSuccessfully = this.save({
      stats: this.stats.toObject(),
      lastGameState: finalGameState,
    });
    console.log(userSavedSuccessfully);
  }

  async save(properties) {
    return updateUser(this, properties)
  }

  /**
   * Obtains the salt for the user.
   * @returns Returns the salt.
   */
  getSalt() {
    return this.hash.substring(0, 32);
  }

  /**
   * Obtains the hashed password for the user.
   * @returns
   */
  getHash() {
    return this.hash.substring(32);
  }

  /**
   * Used to ignore undefined values to avoid unnecessary data in documents. See {@link insertUser}
   * @returns Returns a copy of the user object with undefined values removed.
   */
  getWithoutUndefined() {
    return Object.fromEntries(
      Object.entries(this).filter(([key, value]) => value !== undefined)
    );
  }
}

export default User;
