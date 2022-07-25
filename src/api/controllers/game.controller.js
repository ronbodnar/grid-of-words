import { v4 as uuidv4 } from "uuid";

import { getWordOfLength } from "../repository/word.repository.js";
import { getGameById, insertGame } from "../repository/game.repository.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../constants.js";

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

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await getWordOfLength(wordLength);

  console.log(uuid, word, wordLength, maxAttempts);

  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await insertGame(uuid, word, maxAttempts);
  if (createdGame == null) {
    console.error("Failed to create a new Game entry");
    return res.json({ message: "Game creation failed" });
  }
  console.log("Created Game: ", createdGame);

  req.session.gameId = createdGame.id;

  res.json(createdGame);
};

/*
 * Endpoint: GET /game/{id}
 *
 * Retrieves a game object from the database.
 */
export const getGame = async (req, res) => {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const game = await getGameById(req.params.id);
  res.json(game);
};

/*
 * Endpoint: POST /game/{id}/forfeit
 *
 * Forfeits the specified game and clears the game session.
 */
export const forfeitGame = async (req, res) => {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  req.session.gameId = undefined;

  // Update the game's state to FORFEIT and update the record in the repository.
  const game = await getGameById(req.params.id);
  game.state = "FORFEIT";
  game.save();
  res.json(game);
};
