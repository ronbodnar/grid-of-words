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
async function generateGame(req, res) {
  const wordLength = req.query.wordLength || DEFAULT_WORD_LENGTH;
  const timed = req.query.timed != null && req.query.timed === "true";
  const hideWord = req.query.hideWord && req.query.hideWord === "true";
  const maxAttempts = req.query.maxAttempts != null || DEFAULT_MAX_ATTEMPTS;

  // Ensure wordLength is valid.
  if (!(MINIMUM_WORD_LENGTH < wordLength < MAXIMUM_WORD_LENGTH)) {
    console.error("Invalid word length");
    return res.end();
  }

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await getWordOfLength(wordLength);

  console.log(uuid, word.text, maxAttempts, timed);
  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await insertGame(uuid, word.text, maxAttempts, timed);
  console.log("Created Game: ", createdGame);
  if (hideWord) createdGame.word = undefined;
  
  req.session.gameId = createdGame.id;

  return res.json(createdGame);
}

/*
 * Endpoint: GET /game/{id}
 *
 * Retrieves a game object from the database.
 */
async function getGame(req, res) {
  const hideWord = req.query.hideWord != null && req.query.hideWord === "true";
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const game = await getGameById(req.params.id);
  if (hideWord) game.word = undefined;
  return res.json(game);
}

export { getGame, generateGame };
