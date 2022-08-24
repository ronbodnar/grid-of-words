import { Game, GameState, gameRepository } from "./index.js";
import { NotFoundError, InternalError, ValidationError } from "../../errors/index.js";
import {
  MAXIMUM_MAX_ATTEMPTS,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_MAX_ATTEMPTS,
  MINIMUM_WORD_LENGTH,
} from "../../shared/constants.js";
import { wordRepository } from "../word/index.js";
import { ObjectId } from "mongodb";
import { User } from "../user/User.js";
import { authService } from "../auth/index.js";
import logger from "../../config/winston.config.js";

// TODO: separate validation / implement Joi

/**
 * Generates a new Game object.
 *
 * @param {number} wordLength The length of the word to assign as the target word.
 * @param {number} maxAttempts The maximum number of attempts in the game.
 * @param {User} authenticatedUser The logged in user who requested a new game.
 * @returns {Promise<Game | ValidationError | InternalError | NotFoundError>} A promise that resolves to the created Game object if successful.
 */
export const generateNewGame = async (wordLength, maxAttempts, authenticatedUser) => {
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

  const word = await wordRepository.findByLength(wordLength);
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

  const createdGameId = await gameRepository.insertGame(game);
  if (!createdGameId) {
    return new InternalError("Failed to insert new game into the database", {
      word: word,
      wordLength: wordLength,
      maxAttempts: maxAttempts,
      userId: authenticatedUserId,
    });
  }

  const createdGame = await gameRepository.findById(createdGameId);
  if (!createdGame) {
    return new NotFoundError("Failed to find the newly created game", {
      gameId: createdGameId,
    });
  }
  return createdGame;
};

/**
 * Adds an attempt to the Game's `attempt` Array if no validation errors occur.
 *
 * @param {string} word The word that is being attempted.
 * @param {string | ObjectId} gameId The id of the game that the attempt is being made against.
 * @param {string} authToken The JWT from the request header to assign an owner to the game.
 * @returns {Promise<object | ValidationError | InternalError | NotFoundError>} A promise that resolves with the attempt message and game data if successful.
 */
export const addAttempt = async (word, gameId, authToken) => {
  const game = await gameRepository.findById(gameId);
  if (!game) {
    return new NotFoundError("GAME_NOT_FOUND", {
      gameId: gameId,
    });
  }

  const authenticatedUser = authService.getAuthenticatedUser(authToken);

  const validationMessage = await validateAttempt(word, game);
  if (validationMessage.length > 0) {
    return new ValidationError(validationMessage, {
      status: "error",
      message: validationMessage,
      game: game,
      authenticatedUser: authenticatedUser,
    });
  }

  const isCorrectAttempt = game.word === word;
  const isFinalAttempt = game.attempts.length + 1 === game.maxAttempts;

  let responseMessage = "WRONG_WORD";
  if (isFinalAttempt || isCorrectAttempt) {
    game.state = isCorrectAttempt ? GameState.WINNER : GameState.LOSER;
    game.endTime = new Date();
    responseMessage = isCorrectAttempt ? "WINNER" : "LOSER";
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
 * Asynchronously retrieves a {@link Game} with the `gameId` from the database.
 *
 * @param {string | ObjectId} gameId The unique ID of the game.
 * @returns {Promise<Game | NotFoundError>} A promise that resolves to the Game object if successful.
 */
export const getGame = async (gameId) => {
  const game = await gameRepository.findById(gameId);
  if (!game) {
    return new NotFoundError("No game found for the provided id", {
      gameId: gameId,
    });
  }
  return game;
};

/**
 * Finds the specified {@link Game} ID in the database and abandons the game if found.
 *
 * @param {string | ObjectId} gameId The id of the game to abandon.
 * @returns {Promise<object | InternalError | NotFoundError>} A promise that resolves to an empty object if successful.
 */
export const abandonGame = async (gameId) => {
  const game = await gameRepository.findById(gameId);
  if (game) {
    game.state = GameState.ABANDON;
    const gameSavedSuccessfully = await game.save();
    if (!gameSavedSuccessfully) {
      return new InternalError("Failed to save game to the database", {
        gameId: gameId,
        game: game,
      });
    }
    return {};
  }

  return new NotFoundError("No game found for abandon request", {
    gameId: gameId,
  });
};

/**
 * Validates the attempt and handles the response accordingly.
 *
 * @param {string} word The word to validate.
 * @param {Game} Game The game to validate the word against.
 * @return {Promise<string>} A promise that resolves to an error message string or an empty string if no errors were found.
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
  var validWord = await wordRepository.exists(word);
  if (!validWord) {
    return "NOT_IN_WORD_LIST";
  }
  return "";
};