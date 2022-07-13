import * as gameRepository from "../repository/game.repository.js";
import * as wordRepository from "../repository/word.repository.js";
import * as attemptRepository from "../repository/attempt.repository.js";

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
  const attempts = await attemptRepository.getAttempts(req.params.id);
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
  const hideWord = req.query.hideWord; // for playing via API calls
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
  if (!(await attemptRepository.addAttempt(gameId, word))) {
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
  gameRepository.save(game);

  // This is for playing via API calls, it's safe since we just saved to the database.
  if (hideWord) game.word = undefined;

  var message = finalAttempt ? "LOSER" : "WRONG_WORD";
  if (correctWord) message = "WINNER";

  return res.json({
    type: "info",
    message: message,
    gameData: game,
  });
}

export { attempt, getAttempts };
