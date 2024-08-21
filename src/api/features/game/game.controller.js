import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/constants.js";
import { setCookie } from "../../shared/helpers.js";
import { InternalError } from "../../errors/InternalError.js";
import { ValidationError } from "../../errors/ValidationError.js";
import { Game, gameService } from "./index.js";
import { getAuthenticatedUser } from "../auth/authentication.service.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

/**
 * Generates a new game with optional wordLength and maxAttempts params and adds the game to the user's cookies if successful.
 *
 * Endpoint: GET /game/new
 */
const generateNewGame = async (req, res, next) => {
  const wordLength = parseInt(req.query.wordLength) || DEFAULT_WORD_LENGTH;
  const maxAttempts = parseInt(req.query.maxAttempts) || DEFAULT_MAX_ATTEMPTS;
  const authenticatedUser = getAuthenticatedUser(req.cookies.token);

  const newGame = await gameService.generateNewGame(wordLength, maxAttempts, authenticatedUser);
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
const addAttempt = async (req, res, next) => {
  const authToken = req.cookies.token;
  const { 
    word, gameId
  } = req.body;
  
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
const getGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }
  return res.json(gameService.getGame(gameId));
};

/**
 * Forfeits the specified game and clears the game session.
 *
 * Endpoint: POST /game/{id}/forfeit
 */
const forfeitGameById = async (req, res, next) => {
  const gameId = req.params.id;
  if (!gameId) {
    return next(new ValidationError("Missing id parameter"));
  }

  const forfeitResult = gameService.forfeitGame(gameId);
  if (!forfeitResult) {
    const error = new InternalError("Failed to retrieve forfeit response", {
      gameId: gameId,
      forfeitResponse: forfeitResult,
    });
    return next(error);
  }

  if (forfeitResult instanceof Error) {
    return next(forfeitResult);
  }

  res.clearCookie("game");

  return res.json(forfeitResult);
};

export default {
  generateNewGame,
  addAttempt,
  getGameById,
  forfeitGameById,
}