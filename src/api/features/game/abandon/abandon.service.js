import logger from "../../../config/winston.config.js";
import InternalError from "../../../errors/InternalError.js";
import NotFoundError from "../../../errors/NotFoundError.js";
import { findGameById } from "../game.repository.js";
import { getAuthenticatedUser } from "../../auth/authentication.service.js";
import { updateStats } from "../../user/statistics/statistics.service.js";
import GameState from "../GameState.js";

/**
 * Finds the specified {@link Game} ID in the database and abandons the game if found.
 *
 * @async
 * @param {ObjectId} gameId The id of the game to abandon.
 * @returns {Promise<object|InternalError|NotFoundError>} A promise that resolves to an empty object if successful.
 */
export const abandonGameById = async (gameId, authToken) => {
  const game = await findGameById(gameId);
  if (!game) {
    return new NotFoundError("No game found for abandon request", {
      gameId: gameId,
    });
  }

  // Update the user's statistics if the game had an owner.
  if (game.ownerId) {
    const authenticatedUser = await getAuthenticatedUser(authToken);
    if (authenticatedUser?._id.toString() !== game.ownerId.toString()) {
      logger.warn(
        "Failed to update stats on abandon: Authenticated user id does not match the game's owner id",
        {
          game: game,
          gameId: gameId,
          authenticatedUser: authenticatedUser,
        }
      );
      return;
    }

    const updateStatsResult = await updateStats(
      authenticatedUser,
      -1,
      GameState.ABANDONED
    );
    if (!updateStatsResult) {
      return new InternalError(
        "Failed to update user stats after game abandonment.",
        {
          authenticatedUser: authenticatedUser,
          game: game,
        }
      );
    }
  }

  const gameSavedSuccessfully = await game.save();
  if (!gameSavedSuccessfully) {
    return new InternalError("Failed to save game to the database", {
      gameId: gameId,
      game: game,
    });
  }
  return {};
};
