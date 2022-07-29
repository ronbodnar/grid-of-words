import {
  getAttemptsForGameId,
  insertAttempt,
} from "../repository/attempt.repository.js";
import { wordExists } from "../repository/word.repository.js";
import { getGameById } from "../repository/game.repository.js";
import { isUUID } from "../helpers.js";
import logger from "../config/winston.config.js";

/*
 * Endpoint: GET /game/{id}/attempts
 *
 * Retrieves a list of attempts made for a Game.
 */
export const getAttempts = async (req, res) => {
  const gameId = req.params.id;

  // Ensure there is a valid gameId.
  if (gameId == null) {
    return res.json({
      message: "MISSING PARAMETERS",
    });
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return res.json({
      message: "INVALID GAME ID FORMAT",
    });
  }
  const attempts = await getAttemptsForGameId(gameId);
  res.json(attempts);
};

/*
 * Endpoint: POST /game/{id}/attempts
 *
 * Attempts to solve the word puzzle.
 */
export const addAttempt = async (req, res) => {
  const word = req.body.word;
  const gameId = req.params.id;
  
  // Ensure that both word and gameId are present.
  if (word === undefined || gameId === undefined) {
    return res.json({
      message: "MISSING_WORD_OR_GAME_ID",
    });
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return res.json({
      message: "INVALID_GAME_ID_FORMAT",
    });
  }

  // Synchronously retrieve the game object and ensure it was found.
  const game = await getGameById(gameId);
  if (!game) {
    return res.json({
      message: "GAME_NOT_FOUND",
    });
  }

  // Set up variables to determine conditions on the game object.
  const correctWord = game.word === word;
  const finalAttempt = game.attempts.length + 1 === game.maxAttempts;

  // Ensure the attempt is valid before proceeding.
  const validationError = await validateAttempt(word, game);
  if (validationError.length > 0) {
    // Just for testing
    logger.info("Attempt invalid:", {
      error: validationError,
      gameData: game,
    });
    return res.json({
      message: validationError,
      gameData: game,
    });
  }

  // Add the attempt to the game's attempt list.
  game.attempts.push(word);

  // Push the attempt to the repository
  await insertAttempt(gameId, word);

  // Update some game info
  if (finalAttempt || correctWord) {
    req.session.gameId = undefined; // also clear the session variable
    game.state = correctWord ? "WIN" : "LOSS";
    game.endTime = new Date();
  }

  // Save the game to the database.
  if (!game.save()) {
    logger.error("Error saving game to database", {
      game: game,
    });
  }

  // Update the message response.
  var message = finalAttempt ? "LOSER" : "WRONG_WORD";
  if (correctWord) message = "WINNER";

  res.json({
    message: message,
    gameData: game,
  });
};

/*
 * Validates the attempt and handles the response accordingly.
 *
 * @param {object} res Express response object.
 * @param {string} word The word to validate.
 * @param {object} Game The game to validate the word against.
 * @return {boolean} true if the attempt is valid, false otherwise.
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
  var validWord = await wordExists(word);
  if (!validWord) {
    return "NOT_IN_WORD_LIST";
  }
  return "";
};
