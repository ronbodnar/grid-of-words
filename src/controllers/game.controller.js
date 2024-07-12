import { v4 as uuidv4 } from "uuid";

import * as wordRepository from "../repository/word.repository.js";
import * as gameRepository from "../repository/game.repository.js";
import {
  DEFAULT_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_WORD_LENGTH,
} from "../constants.js";

/*
 * Endpoint: GET /game/new
 *
 * Generate a new game and get a random word with the provided length.
 */
async function generate(req, res) {
  const wordLength = req.query.wordLength || DEFAULT_WORD_LENGTH;

  // Ensure wordLength is valid.
  if (!(MINIMUM_WORD_LENGTH < wordLength < MAXIMUM_WORD_LENGTH)) {
    console.error("Invalid word length");
    return res.end();
  }

  // Generate the UUID and selet a random word of wordLength length.
  const uuid = uuidv4();
  const word = await wordRepository.getRandomWord(wordLength);

  // Create a new Game entry in the database with a generated UUID.
  const createdGame = await gameRepository.create(uuid, word.text);
  console.log("Created Game: ", createdGame);
  return res.json(createdGame);
}

/*
 * Endpoint: GET /game/{uuid}
 *
 * Retrieves a game object from the database.
 */
async function get(req, res) {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const game = await gameRepository.get(req.params.id);
  return res.json(game);
}

/*
 * Endpoint: GET /game/{uuid}/attempts
 *
 * Retrieves a list of attempts made for a Game.
 */
async function getAttempts(req, res) {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const attempts = await gameRepository.getAttempts(req.params.id);
  return res.json(attempts);
}

/*
 * Endpoint: POST /game/{uuid}/attempt
 *
 * Attempts to solve the word puzzle.
 */

// This shouldn't all be in here
async function attempt(req, res) {
  const word = req.query.word;
  const gameId = req.params.id;
  if (word === undefined || gameId === undefined) {
    return res.json({
      type: "error",
      message: "NO_WORD_OR_NO_ID",
    });
  }

  // Grab the game record from the database.
  const game = await gameRepository.get(gameId);
  if (game == null) {
    return res.json({
      type: "error",
      message: "GAME_NOT_FOUND",
    });
  }

  // Make sure there's nothing fishy going on with the attempts.
  if (game.attempts.length > game.maxAttempts) {
    return res.json({
      type: "error",
      message: "ATTEMPTS_EXCEEDED",
      gameData: JSON.stringify(game),
    });
  }

  // Validate the word exists and length matches (doesn't count as an attempt)
  var validWord = await wordRepository.exists(word);
  if (!validWord) {
    return res.json({
      type: "error",
      message: "NOT_IN_WORD_LIST",
    });
  }

  if (word.length != game.word.length) {
    return res.json({
      type: "error",
      message: "WORD_LENGTH_MISMATCH",
    });
  }

  game.attempts.push(word); // this is for the return when the game ends
  await gameRepository.addAttempt(gameId, word);

  const finalAttempt = game.attempts.length === game.maxAttempts;

  // Check if the word is correct
  if (game.word !== word) {
    game.state = "LOSS";
    game.endTime = new Date();
    return res.json({
      type: "info",
      message: finalAttempt ? "LOSER" : "WORD_MISMATCH",
      gameData: JSON.stringify(game),
    });
  } else {
    game.state = "WIN";
    game.endTime = new Date();
    return res.json({
      type: "info",
      message: "WINNER",
      gameData: JSON.stringify(game),
    });
  }
}

export { get, generate, attempt, getAttempts };
