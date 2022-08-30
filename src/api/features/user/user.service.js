import logger from "../../config/winston.config.js";
import InternalError from "../../errors/InternalError.js";
import GameState from "../game/GameState.js";
import UserStats from "./UserStats.js";

export const updateStats = async (user, numAttempts, finalGameState) => {
  if (!user || !numAttempts || !finalGameState) {
    return new InternalError(
      "Missing required arguments: userId, numAttempts, finalGameState",
      {
        user: user,
        numAttempts: numAttempts,
        finalGameState: finalGameState,
      }
    );
  }

  const isWinner = finalGameState === GameState.WINNER;
  const isAbandoned = finalGameState === GameState.ABANDONED;
  const hasBestWinStreak =
    isWinner && user.stats?.bestWinStreak < user.stats?.winStreak + 1;

  logger.debug("User stats before update", user.stats);

  // User stats will be undefined until they end their first game, so we have to assign it here.
  if (!user.stats) {
    user.stats = new UserStats();
  }

  user.stats.totalGames += 1;
  user.stats.losses += isWinner || isAbandoned ? 0 : 1;
  user.stats.abandoned += isAbandoned ? 1 : 0;
  user.stats.winStreak = isWinner ? user.stats.winStreak + 1 : 0;

  if (hasBestWinStreak) {
    user.stats.bestWinStreak = user.stats.winStreak;
  }

  if (isWinner) {
    user.stats.wins[numAttempts] = user.stats.wins[numAttempts] || 0;
    user.stats.wins[numAttempts] += 1;
  }

  logger.debug("User stats after update", user.stats);

  return user.save({
    stats: user.stats,
    lastGameState: finalGameState,
  });
};

export const getStatistics = async (user) => {
  if (!user) {
    return new InternalError("Missing required argument: user");
  }
  console.log(user);
  return user.stats;
}
