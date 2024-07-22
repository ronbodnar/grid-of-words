import { v4 as uuidv4 } from "uuid";

import { getWordOfLength } from "../repository/word.repository.js";
import { getGameById, insertGame, saveGame } from "../repository/game.repository.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../constants.js";

/*
 * Endpoint: GET /game/new
 *
 * Generate a new game and get a random word with the provided length.
 */
async function generateGame(req, res) {
  const wordLength = req.query.wordLength || -1;
  const timed = req.query.timed != null && req.query.timed === "true";
  const maxAttempts = req.query.maxAttempts != null || DEFAULT_MAX_ATTEMPTS;

  // Ensure wordLength is valid.
  if (!(MINIMUM_WORD_LENGTH < wordLength || wordLength > MAXIMUM_WORD_LENGTH)) {
    return res.json({
      type: "error",
      message: "MISSING_PARAMETERS",
    });
  }

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await getWordOfLength(wordLength);

  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await insertGame(uuid, word.text, maxAttempts, timed);
  console.log("Created Game: ", createdGame);

  req.session.gameId = createdGame.id;

  res.json(createdGame);
}

/*
 * Endpoint: GET /game/{id}
 *
 * Retrieves a game object from the database.
 */
async function getGame(req, res) {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const game = await getGameById(req.params.id);
  res.json(game);
}

/*
 * Endpoint: POST /game/{id}/forfeit
 *
 * Forfeits the specified game.
 */
async function forfeitGame(req, res) {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  showView("loading");
  
  req.session.gameId = undefined;

  // Update the game's state to FORFEIT and update the record in the repository.
  const game = await getGameById(req.params.id);
  game.state = "FORFEIT";
  saveGame(game);
  res.json(game);
}

export { getGame, generateGame, forfeitGame };
