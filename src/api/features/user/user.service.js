import logger from "../../config/winston.config.js";
import InternalError from "../../errors/InternalError.js";
import GameState from "../game/GameState.js";

export const updateStats = async (user, numAttempts, finalGameState) => {
  if (!user || !numAttempts || !finalGameState) {
    throw new InternalError(
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
    user.stats?.bestWinStreak <= user.stats?.winStreak + 1;

  logger.debug("User stats before update", user.stats);

  user.stats.totalGames += 1;
  user.stats.losses += isWinner || isAbandoned ? 0 : 1;
  user.stats.abandoned += isAbandoned ? 1 : 0;
  user.stats.winStreak = isWinner ? user.stats.winStreak + 1 : 0;
  user.stats.bestWinStreak += hasBestWinStreak ? 1 : 0;
  if (isWinner) {
    user.stats.wins[numAttempts] = user.stats.wins[numAttempts] || 0;
    user.stats.wins[numAttempts] += 1;
  }

  logger.debug("User stats after update", user.stats);

  const userSavedSuccessfully = await user.save({
    stats: user.stats,
    lastGameState: finalGameState,
  });
  if (!userSavedSuccessfully) {
    throw new InternalError("Failed to update User record in database", {
      stats: stats,
    });
  }
};
