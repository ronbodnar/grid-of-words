import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js";
import { setCookie } from "../../shared/helpers.js";
import {
  NotFoundError,
  InternalError,
  ValidationError,
} from "../../errors/index.js";
import { Game, gameService } from "./index.js";
import { authService } from "../auth/index.js";

/**
 * Generates a new game with optional wordLength and maxAttempts params and adds the game to the user's cookies if successful.
 *
 * Endpoint: GET /game/new
 */
export const generateNewGame = async (req, res, next) => {
  const wordLength = parseInt(req.query.wordLength) || DEFAULT_WORD_LENGTH;
  const maxAttempts = parseInt(req.query.maxAttempts) || DEFAULT_MAX_ATTEMPTS;
  const authenticatedUser = authService.getAuthenticatedUser(req.cookies.token);

  const newGame = await gameService.generateNewGame(
    wordLength,
    maxAttempts,
    authenticatedUser
  );
  if (newGame instanceof Error) {
    return next(newGame);
  }

  setCookie(res, "game", newGame);

  return res.json(newGame);
};

/**
 * Attempts to solve the word puzzle.
 *
 * Endpoint: POST /game/{id}/attempt
 */
export const addAttempt = async (req, res, next) => {
  console.log(req.body, req.params, req.query);
  const authToken = req.cookies.token;
  const gameId = req.params.id;
  const word = req.body.word;

  console.log(word, gameId);
  if (!word || !gameId) {
    return next(new ValidationError("MISSING_WORD_OR_GAME_ID"));
  }

  const attemptResult = await gameService.addAttempt(word, gameId, authToken);
  if (attemptResult instanceof Error) {
    // Clear cookies when the user is attempting an invalid game.
    if (attemptResult instanceof NotFoundError) {
      res.clearCookie("game");
    }
    return next(attemptResult);
  }

  const { gameData, resultMessage } = attemptResult;
  const isFinalAttempt =
    resultMessage === "WINNER" || resultMessage === "LOSER";

  // Update the cookies depending on the attempt result
  if (gameData && gameData instanceof Game) {
    if (isFinalAttempt) {
      res.clearCookie("game");
    } else {
      setCookie(res, "game", gameData);
    }
  } else {
    console.log("Unexpected attemptResult response", attemptResult);
  }

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
  return res.json(gameService.getGame(gameId));
};

/**
 * Abandons the specified game and clears the game session.
 *
 * Endpoint: POST /game/{id}/abandon
 */
export const abandonGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }

  const abandonResult = gameService.abandonGame(gameId);
  if (!abandonResult) {
    const error = new InternalError("Failed to retrieve abandon response", {
      gameId: gameId,
      abandonResponse: abandonResult,
    });
    return next(error);
  }

  if (abandonResult instanceof Error) {
    return next(abandonResult);
  }

  res.clearCookie("game");

  return res.json(abandonResult);
};