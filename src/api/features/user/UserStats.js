import logger from "../../config/winston.config.js";
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
  losses = 0;
  abandoned = 0;

  constructor(obj = {}) {
    if (typeof obj !== "object") {
      throw new ValidationError("Invalid argument: obj must be an object");
    }

    const validKeys = Object.keys(this);
    const objEntries = Object.entries(obj);

    //TODO: remove some of the validation
    for (const [key, value] of objEntries) {
      if (!validKeys.includes(key)) {
        logger.warn("Invalid entry for UserStats: " + key);
        continue;
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
                "Invalid argument: wins array values must be numbers",
                {
                  value: val,
                }
              );
            }
          });
        }
      } else if (key !== "wins" && typeof value !== "number") {
        throw new ValidationError(
          "Invalid argument: obj values must be numbers",
          {
            key: key,
            value: value,
          }
        );
      }

      Object.defineProperty(this, key, { value: value });
    }
  }

  getWinRate() {
    if (this.totalGames === 0) {
      return 0.0;
    }
    const sumOfWins = this.wins.forEach((winCount) => (sumOfWins += winCount));
    return (this.wins[this.totalGames] / this.totalGames) * 100.0;
  }

  toObject() {
    return Object.fromEntries(Object.entries(this));
  }
}

export default UserStats;
