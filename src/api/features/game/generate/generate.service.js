import {
  MAXIMUM_MAX_ATTEMPTS,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_MAX_ATTEMPTS,
  MINIMUM_WORD_LENGTH,
} from "../../../shared/constants.js";
import Game from "../Game.js";
import NotFoundError from "../../../errors/NotFoundError.js";
import InternalError from "../../../errors/InternalError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { findByLength } from "../../word/word.repository.js";
import { findGameById, insertGame } from "../game.repository.js";

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
  wordLength,
  maxAttempts,
  authenticatedUser
) => {
  if (!wordLength || !maxAttempts) {
    return new ValidationError(
      "Missing required parameters: wordLength, maxAttempts"
    );
  }

  const validWordLength =
    MINIMUM_WORD_LENGTH <= wordLength && wordLength <= MAXIMUM_WORD_LENGTH;
  if (!validWordLength) {
    return new ValidationError("Invalid word length", {
      wordLength: wordLength,
    });
  }

  const validMaxAttempts =
    MINIMUM_MAX_ATTEMPTS <= maxAttempts && maxAttempts <= MAXIMUM_MAX_ATTEMPTS;
  if (!validMaxAttempts) {
    return new ValidationError("Invalid max attempts", {
      maxAttempts: maxAttempts,
    });
  }

  const word = await findByLength(wordLength);
  if (!word) {
    return new InternalError(
      "Failed to obtain a random word when creating a new game",
      {
        wordLength: wordLength,
      }
    );
  }
  if (word instanceof Error) {
    return word;
  }

  const authenticatedUserId = authenticatedUser?._id
    ? authenticatedUser._id
    : undefined;

  const game = new Game({
    word: word,
    maxAttempts: maxAttempts,
    ownerId: authenticatedUserId,
  });

  const createdGameId = await insertGame(game);
  if (!createdGameId) {
    return new InternalError("Failed to insert new game into the database", {
      word: word,
      wordLength: wordLength,
      maxAttempts: maxAttempts,
      userId: authenticatedUserId,
    });
  }

  const createdGame = await findGameById(createdGameId);
  if (!createdGame) {
    return new NotFoundError("Failed to find the newly created game", {
      gameId: createdGameId,
    });
  }
  return createdGame;
};
