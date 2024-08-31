import Game from "./Game.js"
import NotFoundError from "../../errors/NotFoundError.js"
import { findGameById } from "./game.repository.js"

/**
 * Asynchronously retrieves a {@link Game} with the `gameId` from the database.
 *
 * @async
 * @param {ObjectId} gameId The unique ID of the game.
 * @returns {Promise<Game|NotFoundError>} A promise that resolves to the Game object if successful.
 */
export const getGameById = async (gameId) => {
  const game = await findGameById(gameId)
  if (!game) {
    return new NotFoundError("No game found for the provided id", {
      gameId: gameId,
    })
  }
  return game
}
