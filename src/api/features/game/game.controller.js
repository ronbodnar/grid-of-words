import { v4 as uuidv4 } from "uuid";
import logger from "../../config/winston.config.js";
import { getGameById, insertGame } from "./game.repository.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../../constants.js";
import { isUUID, setCookie } from "../../utils/helpers.js";
import { wordRepository } from "../word/index.js";
import { authService } from "../auth/index.js";

/**
 * Generate a new game and get a random word with the provided length.
 *
 * Endpoint: GET /game/new
 */
export const generateGame = async (req, res) => {
  const wordLength = req.query.wordLength || DEFAULT_WORD_LENGTH;
  const maxAttempts = req.query.maxAttempts || DEFAULT_MAX_ATTEMPTS;

  // Ensure wordLength within the allowed range.
  // Respond with a 400 Bad Request if the value is out of bounds.
  if (
    !(MINIMUM_WORD_LENGTH <= wordLength && wordLength <= MAXIMUM_WORD_LENGTH)
  ) {
    return res.status(400).json({
      status: "error",
      message: "INVALID WORD LENGTH",
    });
  }

  // Ensure maxAttempts is within the allowed range.
  // Respond with a 400 Bad Request if the value is out of bounds.
  if (
    !(
      MINIMUM_MAX_ATTEMPTS <= maxAttempts && maxAttempts <= MAXIMUM_MAX_ATTEMPTS
    )
  ) {
    return res.status(400).json({
      status: "error",
      message: "INVALID MAX ATTEMPTS",
    });
  }

  // Generate a v4 UUID for the new game.
  const uuid = uuidv4();

  // Select a random word of the provided length.
  // Respond with a 500 Internal Server Error if no word was found.
  const word = await wordRepository.getWordOfLength(wordLength);
  if (!word) {
    logger.error("Failed to fetch a word for new Game entry");
    return res.status(500).json({
      status: "error",
      message: "Game creation failed: could not obtain a random word",
    });
  }

  // Get the optional authenticated user who requested the new game.
  const authenticatedUser = authService.getAuthenticatedUser(req);

  // Extract the user id from the authenticatedUser object or null if the user is not authenticated.
  const userId = authenticatedUser?.id ? authenticatedUser.id : null;

  // Insert a new game with the uuid, word, maxAttempts, and userId into the database.
  // Respond with a 500 Internal Server Error if the insertion fails.
  const createdGame = await insertGame(uuid, word, maxAttempts, userId);
  if (createdGame == null) {
    return res.status(500).json({
      status: "error",
      message: "Game creation failed: could not insert game into database",
    });
  }

  // Save the created game as a cookie in the user's browser.
  setCookie(res, "game", createdGame);

  logger.info("Generated a new Game", {
    uuid: uuid,
    word: word,
    wordLength: wordLength,
    maxAttempts: maxAttempts,
    owner: authenticatedUser,
  });

  res.json(createdGame);
};

/**
 * Retrieves a game object from the database.
 *
 * Endpoint: GET /game/{id}
 */
export const getGame = async (req, res) => {
  const gameId = req.params.id;

  // Ensure there is a valid gameId.
  if (gameId == null) {
    return res.json({
      status: "error",
      message: "No id parameter provided.",
    });
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return res.json({
      status: "error",
      message: "INVALID GAME ID FORMAT",
    });
  }

  // Wait for the game object to be available from the database.
  const game = await getGameById(gameId);

  res.json(game);
};

/**
 * Forfeits the specified game and clears the game session.
 *
 * Endpoint: POST /game/{id}/forfeit
 */
export const forfeitGame = async (req, res) => {
  const gameId = req.params.id;

  // Ensure there is a valid gameId.
  if (gameId == null) {
    return res.json({
      status: "error",
      message: "No id parameter provided.",
    });
  }

  // Ensure the gameId is a valid UUID string.
  if (!isUUID(gameId)) {
    return res.json({
      status: "error",
      message: "INVALID GAME ID FORMAT",
    });
  }

  // Clear the game session from cookies.
  res.clearCookie("game");

  // Update the game's state to FORFEIT and update the record in the repository.
  const game = await getGameById(gameId);
  if (!game) {
    return res.status(404).json({
      status: "error",
      message: "GAME NOT FOUND",
    });
  }

  game.state = "FORFEIT";
  game.save();

  // Send the game we forfeited to the server. (Why?)
  res.json(game);
};
