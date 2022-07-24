import {
  getAttemptsForGameId,
  insertAttempt,
} from "../repository/attempt.repository.js";
import { wordExists } from "../repository/word.repository.js";
import { getGameById } from "../repository/game.repository.js";

/*
 * Endpoint: GET /game/{id}/attempts
 *
 * Retrieves a list of attempts made for a Game.
 */
export const getAttempts = async (req, res) => {
  if (req.params.id == null) {
    return res.json({
      status: "error",
      error: "No id parameter provided.",
    });
  }
  const attempts = await getAttemptsForGameId(req.params.id);
  res.json(attempts);
};

/*
 * Endpoint: POST /game/{id}/attempts
 *
 * Attempts to solve the word puzzle.
 */
export const addAttempt = async (req, res) => {
  const word = req.body.word;
  const gameId = req.params.id;
  if (word === undefined || gameId === undefined) {
    return res.json({
      message: "NO_WORD_OR_NO_ID",
    });
  }

  const game = await getGameById(gameId);
  const correctWord = game.word === word;
  const finalAttempt = (game.attempts.length + 1) === game.maxAttempts;

  // Ensure the attempt is valid before proceeding.
  if (!(await validateAttempt(res, word, game))) {
    return;
  }

  // Add the attempt to the game's attempt list.
  game.attempts.push(word);

  // Push the attempt to the repository
  if (!(await insertAttempt(gameId, word))) {
    return res.json({
      type: "error",
      message: "ADD_ATTEMPT_REPOSITORY_ERROR",
    });
  }

  // Update some game info
  if (finalAttempt || correctWord) {
    req.session.gameId = undefined; // also clear the session variable
    game.state = correctWord ? "WIN" : "LOSS";
    game.endTime = new Date();
  }

  // Save the game to the database.
  game.save();

  var message = finalAttempt ? "LOSER" : "WRONG_WORD";
  if (correctWord) message = "WINNER";

  res.json({
    message: message,
    gameData: game,
  });
};

/*
 * Validates the attempt and handles the response accordingly.
 *
 * @param {object} res Express response object.
 * @param {string} word The word to validate.
 * @param {object} Game The game to validate the word against.
 * @return {boolean} true if the attempt is valid, false otherwise.
 */
const validateAttempt = async (res, word, game) => {
  if (game == null) {
    res.json({
      message: "GAME_NOT_FOUND",
    });
    return false;
  }

  // Make sure there's nothing fishy going on with the attempts.
  if (game.attempts.length >= game.maxAttempts) {
    res.json({
      message: "ATTEMPTS_EXCEEDED",
    });
    return false;
  }

  // Make sure the word has not already been attempted.
  if (game.attempts.includes(word)) {
    res.json({
      message: "DUPLICATE_ATTEMPT",
    });
    return false;
  }

  // Validate the word exists and length matches.
  var validWord = await wordExists(word);
  if (!validWord) {
    res.json({
      message: "NOT_IN_WORD_LIST",
    });
    return false;
  }

  // Ensure the word is the same length as the target word.
  if (word.length != game.word.length) {
    res.json({
      message: "WORD_LENGTH_MISMATCH",
    });
    return false;
  }
  return true;
};
