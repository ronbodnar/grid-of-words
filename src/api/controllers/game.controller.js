import { v4 as uuidv4 } from "uuid";

import { getWordOfLength } from "../repository/word.repository.js";
import { getGameById, insertGame } from "../repository/game.repository.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
  MINIMUM_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../constants.js";
import { isUUID } from "../helpers.js";
import logger from "../config/winston.config.js";
import { getAuthenticatedUser } from "../services/authentication.service.js";

/*
 * Endpoint: GET /game/new
 *
 * Generate a new game and get a random word with the provided length.
 */
export const generateGame = async (req, res) => {
  const wordLength = req.query.wordLength || DEFAULT_WORD_LENGTH;
  const maxAttempts = req.query.maxAttempts || DEFAULT_MAX_ATTEMPTS;

  // Ensure wordLength is valid.
  if (
    !(MINIMUM_WORD_LENGTH <= wordLength && wordLength <= MAXIMUM_WORD_LENGTH)
  ) {
    return res.json({
      status: "error",
      message: "INVALID WORD LENGTH",
    });
  }

  // Ensure maxAttempts is valid.
  if (
    !(
      MINIMUM_MAX_ATTEMPTS <= maxAttempts && maxAttempts <= MAXIMUM_MAX_ATTEMPTS
    )
  ) {
    return res.json({
      status: "error",
      message: "INVALID MAX ATTEMPTS",
    });
  }

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await getWordOfLength(wordLength);
  if (!word) {
    // We failed to generate a random word. Now what?
    logger.error("Failed to fetch a word for new Game entry");
    return res.json({
      status: "error",
      message: "Game creation failed: could not obtain a random word",
    });
  }

  const authenticatedUser = getAuthenticatedUser(req);

  // Using a null value since insertGame uses prepared statements and doesn't accept undefined.
  const userId = authenticatedUser?.id ? authenticatedUser.id : null;

  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await insertGame(uuid, word, maxAttempts, userId);
  if (createdGame == null) {
    return res.json({
      status: "error",
      message: "Game creation failed: could not insert game into database",
    });
  }

  // Save the game into the user's cookies.
  res.cookie("game", createdGame, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 15, // 15 days
    sameSite: "strict",
  });

  // Log the game creation event.
  logger.info("Generated a new Game", {
    uuid: uuid,
    word: word,
    wordLength: wordLength,
    maxAttempts: maxAttempts,
    owner: authenticatedUser,
  });

  res.json(createdGame);
};

/*
 * Endpoint: GET /game/{id}
 *
 * Retrieves a game object from the database.
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

  // Synchronously retrieve the game object from the database.
  const game = await getGameById(gameId);

  res.json(game);
};

/*
 * Endpoint: POST /game/{id}/forfeit
 *
 * Forfeits the specified game and clears the game session.
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

  // Clear the game session.
  req.cookies.gameId = undefined;

  // Update the game's state to FORFEIT and update the record in the repository.
  const game = await getGameById(gameId);
  game.state = "FORFEIT";
  game.save();

  // Send the game we forfeited to the server. (Why?)
  res.json(game);
};
