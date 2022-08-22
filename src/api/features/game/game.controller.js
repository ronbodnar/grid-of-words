import logger from "../../config/winston.config.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js";
import { setCookie } from "../../shared/helpers.js";
import { InternalError } from "../../errors/InternalError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { gameService } from "./index.js";

/**
 * Generates a new game with optional wordLength and maxAttempts params and adds the game to the user's cookies if successful.
 *
 * Endpoint: GET /game/new
 */
export const generateNewGame = async (req, res, next) => {
  const wordLength = parseInt(req.query.wordLength) || DEFAULT_WORD_LENGTH;
  const maxAttempts = parseInt(req.query.maxAttempts) || DEFAULT_MAX_ATTEMPTS;

  const newGame = await gameService.generateNewGame(wordLength, maxAttempts);
  if (newGame instanceof Error) {
    return next(newGame);
  }

  logger.info("Successfuly generated a new Game", {
    newGame: newGame,
  });

  setCookie(res, "game", newGame);

  return res.json(newGame);
};

/**
 * Attempts to solve the word puzzle.
 *
 * Endpoint: POST /game/{id}/attempts
 */
export const addAttempt = async (req, res, next) => {
  const word = req.body.word;
  const gameId = req.params.id;
  if (!word || !gameId) {
    return next(new ValidationError("MISSING_WORD_OR_GAME_ID"));
  }

  const attemptResult = await gameService.addAttempt(word, gameId);
  if (attemptResult instanceof Error) {
    return next(attemptResult);
  }

  console.log("Attempt Result", attemptResult);

  // clear if the game is over
  //res.clearCookie("game");
  //setCookie(res, "game", game);

  return res.json(attemptResult);
};

/**
 * Retrieves a game object from the database.
 *
 * Endpoint: GET /game/{id}
 */
export const getGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }
  return res.json(gameService.getGameById(gameId));
};

/**
 * Forfeits the specified game and clears the game session.
 *
 * Endpoint: POST /game/{id}/forfeit
 */
export const forfeitGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }

  const forfeitResult = gameService.forfeitGameById(gameId);
  if (!forfeitResult) {
    return next(
      new InternalError("Failed to retrieve forfeit response", {
        gameId: gameId,
        forfeitResponse: forfeitResult,
      })
    );
  }

  if (forfeitResult instanceof Error) {
    return next(forfeitResult);
  }

  res.clearCookie("game");

  return res.json(forfeitResult);
};
