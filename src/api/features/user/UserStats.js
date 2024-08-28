import logger from "../../config/winston.config.js";
import InternalError from "../../errors/InternalError.js";

class UserStats {
  winStreak = 0;
  bestWinStreak = 0;
  totalGames = 0;
  wins = {};
  losses = 0;
  abandoned = 0;

  constructor(obj = {}) {
    if (typeof obj !== "object") {
      throw new InternalError("Invalid argument: obj must be an object");
    }

    const validKeys = Object.keys(this);
    const objEntries = Object.entries(obj);

    //TODO: remove some of the validation
    for (const [key, value] of objEntries) {
      if (!validKeys.includes(key)) {
        logger.warn("Invalid entry for UserStats: " + key);
        continue;
      }

      const validField =
        (key !== "wins" && typeof value === "number") ||
        (key === "wins" && typeof value === "object");
      if (!validField) {
        throw new InternalError(
          `UserStat value must be a${key === "wins" ? "n object" : " number"}`,
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
    const sumOfWins = this.wins.reduce((sum, winCount) => sum + winCount);
    return (sumOfWins / this.totalGames) * 100.0;
  }

  toObject() {
    return Object.fromEntries(Object.entries(this));
  }
}

export default UserStats;
