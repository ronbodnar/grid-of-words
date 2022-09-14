import {
  MAXIMUM_MAX_ATTEMPTS,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_MAX_ATTEMPTS,
  MINIMUM_WORD_LENGTH,
} from "../../../shared/constants.js"
import Game from "../Game.js"
import NotFoundError from "../../../errors/NotFoundError.js"
import InternalError from "../../../errors/InternalError.js"
import ValidationError from "../../../errors/ValidationError.js"
import { findWordByLength } from "../../word/word.repository.js"
import { findGameById, insertGame } from "../game.repository.js"
import logger from "../../../config/winston.config.js"
import UnauthorizedError from "../../../errors/UnauthorizedError.js"

/**
 * Generates a new Game object.
 *
 * @async
 * @param {number} wordLength The length of the word to assign as the target word.
 * @param {number} maxAttempts The maximum number of attempts in the game.
 * @param {User} authenticatedUser The logged in user who requested a new game.
 * @returns {Promise<Game|ValidationError|InternalError|NotFoundError>} A promise that resolves to the created Game object if successful.
 */
export const generateNewGame = async (
  language,
  wordLength,
  maxAttempts,
  authenticatedUser
) => {
  if (!language || !wordLength || !maxAttempts) {
    return new ValidationError(
      "Required parameters: language, wordLength, maxAttempts"
    )
  }

  if (authenticatedUser === null) {
    return new UnauthorizedError("User session expired. Please log in again.")
  }

  const validLanguage = ["english", "spanish"].includes(language)
  if (!validLanguage) {
    return new ValidationError("Invalid language", {
      language: language,
    })
  }

  const validWordLength =
    MINIMUM_WORD_LENGTH <= wordLength && wordLength <= MAXIMUM_WORD_LENGTH
  if (!validWordLength) {
    return new ValidationError("Invalid word length", {
      wordLength: wordLength,
    })
  }

  const validMaxAttempts =
    MINIMUM_MAX_ATTEMPTS <= maxAttempts && maxAttempts <= MAXIMUM_MAX_ATTEMPTS
  if (!validMaxAttempts) {
    return new ValidationError("Invalid max attempts", {
      maxAttempts: maxAttempts,
    })
  }

  const word = await findWordByLength(wordLength, language)
  if (!word) {
    return new InternalError(
      "Failed to obtain a random word when creating a new game",
      {
        wordLength: wordLength,
      }
    )
  }
  if (word instanceof Error) {
    return word
  }

  const authenticatedUserId = authenticatedUser?._id
    ? authenticatedUser._id
    : undefined

  const game = new Game({
    word: word,
    language: language,
    maxAttempts: maxAttempts,
    ownerId: authenticatedUserId,
  })

  const createdGameId = await insertGame(game)
  if (!createdGameId) {
    return new InternalError("Failed to insert new game into the database", {
      word: word,
      language: language,
      wordLength: wordLength,
      maxAttempts: maxAttempts,
      userId: authenticatedUserId,
    })
  }

  const createdGame = await findGameById(createdGameId)
  if (!createdGame) {
    return new NotFoundError("Failed to find the newly created game", {
      gameId: createdGameId,
    })
  }

  logger.debug("A new game has been generated", {
    game: createdGame,
    word: word,
    language: language,
    wordLength: wordLength,
    maxAttempts: maxAttempts,
    authenticatedUserId: authenticatedUserId,
  })
  return createdGame
}
