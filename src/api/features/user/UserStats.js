import logger from "../../config/winston.config.js";
import InternalError from "../../errors/InternalError.js";

class UserStats {
  winStreak = 0;
  bestWinStreak = 0;
  totalGames = 0;
  wins = {};
  losses = 0;
  abandoned = 0;

  /**
   * Initializes a new instance of the class with the given object properties.
   * 
   * @constructor
   * @param {Object} [obj={}] - An object containing properties to initialize the instance.
   * @throws {InternalError} Throws an error if `obj` is not an object or if a property has an invalid value.
   */
  constructor(obj = {}) {
    if (typeof obj !== "object") {
      throw new InternalError("Invalid argument: obj must be an object");
    }

    const validKeys = Object.keys(this);
    const objEntries = Object.entries(obj);

    for (const [key, value] of objEntries) {
      if (!validKeys.includes(key)) {
        logger.warn("Invalid entry for UserStats: " + key);
        continue;
      }

      // Wins must be an object and everything else must be a number.
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
}

export default UserStats;
