import ValidationError from "../../errors/ValidationError.js";
import { MAXIMUM_MAX_ATTEMPTS, MINIMUM_MAX_ATTEMPTS } from "../../shared/constants.js";

class UserStats {
  winStreak = 0;
  bestWinStreak = 0;
  totalGames = 0;
  wins = new Array(MAXIMUM_MAX_ATTEMPTS - MINIMUM_MAX_ATTEMPTS).fill(null);
  winRate = 0.0;
  losses = 0;
  abandoned = 0;
  abandonRate = 0.0;

  constructor(obj = {}) {
    if (typeof obj !== "object") {
      throw new ValidationError("Invalid argument: obj must be an object");
    }

    const validKeys = Object.keys(this);
    const objEntries = Object.entries(obj);

    for (const [key, value] of objEntries) {
      if (!validKeys.includes(key)) {
        throw new ValidationError("Invalid entry for UserStats: " + key);
      }

      if (key === "wins" && !Array.isArray(value)) {
        throw new ValidationError(
          "Invalid argument: wins must be an array of numbers"
        );
      } else if (key !== "wins" && typeof value !== "number") {
        throw new ValidationError(
          "Invalid argument: obj values must be numbers"
        );
      }

      Object.defineProperty(this, key, { value: value });
    }
  }
}

export default UserStats;
