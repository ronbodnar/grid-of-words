import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js";
import { setCookie } from "../../shared/helpers.js";
import InternalError from "../../errors/InternalError.js";
import NotFoundError from "../../errors/NotFoundError.js";
import ValidationError from "../../errors/ValidationError.js";
import Game from "./Game.js";
import { getAuthenticatedUser } from "../auth/authentication.service.js";
import { abandonGameById, addAttempt, generateNewGame, getGameById } from "./game.service.js";
import logger from "../../config/winston.config.js";

/**
 * Attempts to solve the word puzzle.
 *
 * Endpoint: POST /game/{id}/attempt
 */
export const handleAddAttempt = async (req, res, next) => {
  const authToken = req.cookies.token;
  const gameId = req.params.id;
  const word = req.body.word;

  if (!word || !gameId) {
    return next(new ValidationError("MISSING_WORD_OR_GAME_ID"));
  }

  const attemptResult = await addAttempt(word, gameId, authToken);
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
    logger.warn("Unexpected attemptResult response", attemptResult);
  }

  return res.json(attemptResult);
};

/**
 * Generates a new game with optional wordLength and maxAttempts params and adds the game to the user's cookies if successful.
 *
 * Endpoint: GET /game/new
 */
export const handleGenerateNewGame = async (req, res, next) => {
  const wordLength = parseInt(req.query.wordLength) || DEFAULT_WORD_LENGTH;
  const maxAttempts = parseInt(req.query.maxAttempts) || DEFAULT_MAX_ATTEMPTS;
  const authenticatedUser = await getAuthenticatedUser(req.cookies.token);

  const newGame = await generateNewGame(
    wordLength,
    maxAttempts,
    authenticatedUser
  );
  if (!newGame) {
    return next(new NotFoundError("Failed to generate new game"));
  }
  
  setCookie(res, "game", newGame);

  return res.json(newGame);
};

/**
 * Retrieves a game object from the database.
 *
 * Endpoint: GET /game/{id}
 */
export const handleGetGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }
  return res.json(getGameById(gameId));
};

/**
 * Abandons the specified game and clears the game session.
 *
 * Endpoint: POST /game/{id}/abandon
 */
export const handleAbandonGameById = async (req, res, next) => {
  const gameId = req.params.id;
  const authToken = req.cookies.token;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }

  const abandonResult = abandonGameById(gameId, authToken);
  if (!abandonResult) {
    const error = new InternalError("Failed to retrieve abandon response", {
      gameId: gameId,
      abandonResponse: abandonResult,
    });
    return next(error);
  }

  res.clearCookie("game");

  return res.json(abandonResult);
};