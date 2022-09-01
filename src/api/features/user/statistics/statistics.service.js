import InternalError from "../../../errors/InternalError.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import GameState from "../../game/GameState.js"
import User from "../User.js"
import UserStats from "../UserStats.js"
import { findUserBy } from "../user.repository.js"

/**
 * Finds the {@link User} with the `userId` from the database and returns the User's {@link UserStats} object.
 *
 * @async
 * @param {string} userId The id of the user to retrieve statistics for.
 * @returns {Promise<UserStats|NotFoundError>} The user's statistics.
 */
export const getStatistics = async (userId = "") => {
  const authenticatedUser = await findUserBy("_id", userId)
  if (!authenticatedUser) {
    return new NotFoundError(`User not found with id "${userId}"`)
  }
  if (!authenticatedUser?.statistics) {
    return new NotFoundError("User does not have any statistics")
  }
  return authenticatedUser.statistics
}

/**
 * Updates the user's statistics based on the `numAttempts` and `finalGameState` then saves the updated statistics to the database.
 *
 * @async
 * @param {User} user The user to update statistics for.
 * @param {Number} numAttempts The number of attempts made during the game.
 * @param {GameState} finalGameState The final state of the game.
 * @returns {Promise<User|null>} A promise that resolves to the user if successful.
 */
export const updateStats = async (user, numAttempts, finalGameState) => {
  if (!user || !numAttempts || !finalGameState) {
    return new InternalError(
      "Missing required arguments: userId, numAttempts, finalGameState",
      {
        user: user,
        numAttempts: numAttempts,
        finalGameState: finalGameState,
      }
    )
  }

  const isWinner = finalGameState === GameState.WINNER
  const isAbandoned = finalGameState === GameState.ABANDONED
  const hasBestWinStreak =
    isWinner && user.statistics?.bestWinStreak < user.statistics?.winStreak + 1

  // User stats will be undefined until they end their first game, so we have to assign it here.
  if (!user.statistics) {
    user.statistics = new UserStats()
  }

  user.statistics.totalGames += 1
  user.statistics.losses += isWinner || isAbandoned ? 0 : 1
  user.statistics.abandoned += isAbandoned ? 1 : 0
  user.statistics.winStreak = isWinner ? user.statistics.winStreak + 1 : 0

  if (hasBestWinStreak) {
    user.statistics.bestWinStreak = user.statistics.winStreak
  }

  if (isWinner) {
    user.statistics.wins[numAttempts] = user.statistics.wins[numAttempts] || 0
    user.statistics.wins[numAttempts] += 1
  }

  return user.save({
    statistics: user.statistics,
    lastGameState: finalGameState,
  })
}
