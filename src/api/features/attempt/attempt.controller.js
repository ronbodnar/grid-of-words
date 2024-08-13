import { getAttemptsForGameId, insertAttempt } from "./attempt.repository.js";

import logger from "../../config/winston.config.js";
import { isUUID, setCookie } from "../../utils/helpers.js";
import { gameRepository } from "../game/index.js";
import { wordRepository } from "../word/index.js";
import { authService } from "../auth/index.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { InternalError } from "../../errors/InternalError.js";

/**
 * Retrieves a list of attempts made for a Game.
 *
 * Endpoint: GET /game/{id}/attempts
 */
export const getAttempts = async (req, res) => {
  const gameId = req.params.id;

  // Ensure there is a valid gameId.
  if (gameId == null) {
    return next(new ValidationError("MISSING_PARAMETERS"));
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return next(new ValidationError("INVALID_GAME_ID_FORMAT"));
  }
  const attempts = await getAttemptsForGameId(gameId);
  res.json(attempts);
};

/**
 * Attempts to solve the word puzzle.
 *
 * Endpoint: POST /game/{id}/attempts
 */
export const addAttempt = async (req, res) => {
  const word = req.body.word;
  const gameId = req.params.id;

  // Ensure that both word and gameId are present.
  if (!word === undefined || gameId === undefined) {
    return next(new ValidationError("MISSING_WORD_OR_GAME_ID"));
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return next(new ValidationError("INVALID_GAME_ID_FORMAT"));
  }

  // Synchronously retrieve the game object and ensure it was found.
  const game = await gameRepository.getGameById(gameId);
  if (!game) {
    return next(new ValidationError("GAME_NOT_FOUND"));
  }

  // Set up variables to determine conditions on the game object.
  const correctWord = game.word === word;
  const finalAttempt = game.attempts.length + 1 === game.maxAttempts;

  // Ensure the attempt is valid before proceeding.
  const validationError = await validateAttempt(word, game);
  if (validationError.length > 0) {
    return next(new ValidationError(validationError, {
      status: "error",
      message: validationError,
      game: game,
      reqParams: req.params,
      reqHeaders: req.headers,
      reqBody: req.body,
      reqCookies: req.cookies,
      authenticatedUser: authService.getAuthenticatedUser(req),
    }));
  }

  // Add the attempt to the game's attempt list.
  game.attempts.push(word);

  // Push the attempt to the repository
  if (!(await insertAttempt(gameId, word))) {
    return next(
      new InternalError("Failed to insert attempt into database.", {
        reqParams: req.params,
        reqHeaders: req.headers,
        reqBody: req.body,
        reqCookies: req.cookies,
        word: word,
        game: game,
        gameId: gameId,
        authenticatedUser: authService.getAuthenticatedUser(req),
      })
    );
  }

  // Save the game to the database.
  if (!game.save()) {
    return next(new InternalError("Failed to save game to database after attempt.", {
      reqParams: req.params,
      reqHeaders: req.headers,
      reqBody: req.body,
      reqCookies: req.cookies,
      game: game,
      authenticatedUser: authService.getAuthenticatedUser(req),
    }));
  }

  // Check if this is the final attempt in the game (either the user won or reached max attempts) and update game and remove cookies.
  // Otherwise update the user's game cookie.
  if (finalAttempt || correctWord) {
    game.state = correctWord ? "WIN" : "LOSS";
    game.endTime = new Date();
    res.clearCookie("game");
  } else {
    setCookie(res, "game", game);
  }

  // Update the message response.
  var message = finalAttempt ? "LOSER" : "WRONG_WORD";
  if (correctWord) message = "WINNER";

  res.json({
    status: "success",
    message: message,
    gameData: game,
  });
};

/**
 * Validates the attempt and handles the response accordingly.
 *
 * @param {object} res Express response object.
 * @param {string} word The word to validate.
 * @param {object} Game The game to validate the word against.
 * @return {Promise<boolean>} true if the attempt is valid, false otherwise.
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
  var validWord = await wordRepository.wordExists(word);
  if (!validWord) {
    return "NOT_IN_WORD_LIST";
  }
  return "";
};
