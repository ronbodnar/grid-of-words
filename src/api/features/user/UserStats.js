import ValidationError from "../../errors/ValidationError.js";
import {
  MAXIMUM_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
} from "../../shared/constants.js";

const winsArraySize = MAXIMUM_MAX_ATTEMPTS - MINIMUM_MAX_ATTEMPTS + 1;

class UserStats {
  winStreak = 0;
  bestWinStreak = 0;
  totalGames = 0;
  wins = new Array(winsArraySize).fill(0);
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

    //TODO: remove some of the validation
    for (const [key, value] of objEntries) {
      if (!validKeys.includes(key)) {
        throw new ValidationError("Invalid entry for UserStats: " + key);
      }

      if (key === "wins") {
        if (!Array.isArray(value)) {
          throw new ValidationError(
            "Invalid argument: wins must be an array of numbers"
          );
        } else {
          value.forEach((val) => {
            if (typeof val !== "number") {
              throw new ValidationError(
                "Invalid argument: wins array values must be numbers"
              );
            }
          });
        }
      } else if (key !== "wins" && typeof value !== "number") {
        throw new ValidationError(
          "Invalid argument: obj values must be numbers"
        );
      }

      Object.defineProperty(this, key, { value: value });
    }
  }

  updateFromGame = (finalGameState) => {
    if (!finalGameState) {
      throw new ValidationError(
        "Invalid argument: finalGameState must be provided"
      );
    }
  };
}

export default UserStats;
