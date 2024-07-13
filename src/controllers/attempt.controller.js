import { getAttemptsForGameId, insertAttempt } from "../repository/attempt.repository.js";
import { wordExists } from "../repository/word.repository.js";

/*
 * Endpoint: GET /game/{id}/attempts
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
  const attempts = await getAttemptsForGameId(req.params.id);
  res.json(attempts);
}

/*
 * Endpoint: POST /game/{id}/attempts
 *
 * Attempts to solve the word puzzle.
 */

// This shouldn't all be in here
async function addAttempt(req, res) {
  const word = req.body.word;
  const gameId = req.params.id;
  const hideWord = req.query.hideWord != null && req.query.hideWord === "true";
  if (word === undefined || gameId === undefined) {
    return res.json({
      type: "error",
      message: "NO_WORD_OR_NO_ID",
    });
  }

  // Grab the game record from the database.
  const game = await getGameById(gameId);
  if (game == null) {
    return res.json({
      type: "error",
      message: "GAME_NOT_FOUND",
    });
  }

  // Make sure there's nothing fishy going on with the attempts.
  if (game.attempts.length >= game.maxAttempts) {
    return res.json({
      type: "error",
      message: "ATTEMPTS_EXCEEDED",
    });
  }

  // Make sure the word has not already been attempted.
  if (game.attempts.includes(word)) {
    return res.json({
      type: "error",
      message: "DUPLICATE_ATTEMPT",
    });
  }

  // Validate the word exists and length matches (doesn't count as an attempt)
  var validWord = await wordExists(word);
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
  if (!(await insertAttempt(gameId, word))) {
    return res.json({
      type: "error",
      message: "ADD_ATTEMPT_REPOSITORY_ERROR",
    });
  }

  const finalAttempt = game.attempts.length === game.maxAttempts;
  const correctWord = game.word === word;

  // Update some game info
  if (finalAttempt || correctWord) {
    game.state = correctWord ? "WIN" : "LOSS";
    game.endTime = new Date();
  }

  // Save the game to the database.
  saveGame(game);

  // This is for playing via API calls, it's safe since we just saved to the database.
  if (hideWord) game.word = undefined;

  var message = finalAttempt ? "LOSER" : "WRONG_WORD";
  if (correctWord) message = "WINNER";

  res.json({
    type: "info",
    message: message,
    gameData: game,
  });
}

export { addAttempt, getAttempts };
