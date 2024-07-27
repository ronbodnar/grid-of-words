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
import { logger } from "../../index.js";
import { isUUID } from "../helpers.js";

/*
 * Endpoint: GET /game/new
 *
 * Generate a new game and get a random word with the provided length.
 */
export const generateGame = async (req, res) => {
  const wordLength = req.query.wordLength || DEFAULT_WORD_LENGTH;
  const maxAttempts = req.query.maxAttempts || DEFAULT_MAX_ATTEMPTS;

  // Ensure wordLength is valid.
  if (!(MINIMUM_WORD_LENGTH < wordLength || wordLength > MAXIMUM_WORD_LENGTH)) {
    return res.json({
      message: "INVALID WORD LENGTH",
    });
  }

  // Ensure maxAttempts is valid.
  if (!(MINIMUM_MAX_ATTEMPTS < maxAttempts < MAXIMUM_MAX_ATTEMPTS)) {
    return res.json({
      message: "INVALID MAX ATTEMPTS"
    })
  }

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await getWordOfLength(wordLength);
  if (!word) {
    // We failed to generate a random word. Now what?
    logger.error("Failed to fetch a word for new Game entry");
    return res.json({ message: "Game creation failed: could not obtain a random word" });
  }

  logger.info("Generated a new Game", {
    uuid: uuid,
    word: word,
    wordLength: wordLength,
    maxAttempts: maxAttempts
  });

  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await insertGame(uuid, word, maxAttempts);
  if (createdGame == null) {
    return res.json({ message: "Game creation failed: could not insert game into database" });
  }

  req.session.gameId = createdGame.id;

  res.json(createdGame);
};

/*
 * Endpoint: GET /game/{id}
 *
 * Retrieves a game object from the database.
 */
export const getGame = async (req, res) => {
  const gameId = req.params.id;
  if (gameId == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  if (!isUUID(gameId)) {
    return res.json({
      message: "INVALID GAME ID FORMAT"
    })
  }
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
  if (gameId == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  if (!isUUID(gameId)) {
    return res.json({
      message: "INVALID GAME ID FORMAT"
    })
  }
  req.session.gameId = undefined;

  // Update the game's state to FORFEIT and update the record in the repository.
  const game = await getGameById(gameId);
  game.state = "FORFEIT";
  game.save();
  res.json(game);
};
