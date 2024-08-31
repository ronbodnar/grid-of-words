import GameState from "../GameState.js";
import NotFoundError from "../../../errors/NotFoundError.js";
import InternalError from "../../../errors/InternalError.js";
import ValidationError from "../../../errors/ValidationError.js";
import { findGameById } from "../game.repository.js";
import { getAuthenticatedUser } from "../../auth/authentication.service.js";
import { updateStats } from "../../user/statistics/statistics.service.js";
import { exists } from "../../word/word.repository.js";

/**
 * Adds an attempt to the Game's `attempt` Array if no validation errors occur.
 *
 * @async
 * @param {string} word The word that is being attempted.
 * @param {ObjectId} gameId The id of the game that the attempt is being made against.
 * @param {string} authToken The JWT from the request header to assign an owner to the game.
 * @returns {Promise<object|ValidationError|InternalError|NotFoundError>} A promise that resolves with the attempt message and game data if successful.
 */
export const addAttempt = async (word, gameId, authToken) => {
  const game = await findGameById(gameId);
  if (!game) {
    return new NotFoundError("GAME_NOT_FOUND", {
      gameId: gameId,
    });
  }

  const authenticatedUser = await getAuthenticatedUser(authToken);

  const validationMessage = await validateAttempt(word, game);
  if (validationMessage.length > 0) {
    return new ValidationError(validationMessage, {
      status: "error",
      message: validationMessage,
      game: game,
      authenticatedUser: authenticatedUser,
    });
  }

  const numAttempts = game.attempts.length + 1;
  const isCorrectAttempt = game.word === word;
  const isFinalAttempt = numAttempts === game.maxAttempts;

  let responseMessage = "WRONG_WORD";
  if (isFinalAttempt || isCorrectAttempt) {
    responseMessage = isCorrectAttempt ? "WINNER" : "LOSER";

    game.state = isCorrectAttempt ? GameState.WINNER : GameState.LOSER;
    game.endTime = new Date();

    if (authenticatedUser) {
      const updateStatsResult = await updateStats(
        authenticatedUser,
        numAttempts,
        game.state
      );
      if (!updateStatsResult) {
        return new InternalError(
          "Failed to update user stats after game completion.",
          {
            authenticatedUser: authenticatedUser,
            game: game,
          }
        );
      }
    }
  }

  // Add the attempt to the game's Array of attempts before saving!
  game.attempts.push(word);

  const gameSavedSuccessfully = game.save();
  if (!gameSavedSuccessfully) {
    return new InternalError("Failed to save game to database after attempt.", {
      game: game,
    });
  }

  return {
    message: responseMessage,
    gameData: game,
  };
};

/**
 * Validates the attempt and handles the response accordingly.
 *
 * @async
 * @param {string} word The word to validate.
 * @param {Game} Game The game to validate the word against.
 * @returns {Promise<string>} A promise that resolves to an error message string or an empty string if no errors were found.
 */
const validateAttempt = async (word, game) => {
  switch (true) {
    case game == null:
      return "GAME_NOT_FOUND";
    case game.attempts.length >= game.maxAttempts:
      return "ATTEMPTS_EXCEEDED";
    case game.attempts.includes(word):
      return "DUPLICATE_ATTEMPT";
    case word.length != game.word.length:
      return "WORD_LENGTH_MISMATCH";
  }

  // Validate that the word exists in the word list
  var validWord = await exists(word);
  if (!validWord) {
    return "NOT_IN_WORD_LIST";
  }
  return "";
};
