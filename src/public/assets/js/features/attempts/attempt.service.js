import { setBlockKeyEvents } from "../../shared/services/event.service.js";
import {
  retrieveLocal,
  retrieveSession,
  storeLocal,
  storeSession,
} from "../../shared/services/storage.service.js";
import { showMessage } from "../../shared/services/message.service.js";
import {
  fetchWordList,
  wordExists,
} from "../../shared/services/api.service.js";
import { Game } from "../game/Game.js";
import { transformSquares } from "../gameboard/gameboard.service.js";
import { toggleKeyboardOverlay } from "../keyboard/keyboard.service.js";
import { fetchData } from "../../shared/services/api.service.js";
import { logger } from "../../main.js";
import { processAttemptResponse } from "./attempt-response.js";

let attemptLetters = [];

/**
 * Processes the attempt by querying the API and updating the game container accordingly.
 *
 * @param {Game} game - The game to process to attempt for.
 */
export const processAttempt = async (game) => {
  // Obtain the Game from session data instead of the param to avoid retrieving the game in various views.
  if (!game) {
    const game = retrieveSession("game");
    if (game) {
      processAttempt(game);
    } else {
      throw new Error("No game found in the session");
    }
    return;
  }

  setBlockKeyEvents(true);

  const valid = validateAttempt(game);
  if (!valid) {
    setBlockKeyEvents(false);
    return;
  }

  // Clear the message content while processing the attempt, otherwise it may retain previous messages.
  showMessage("");

  const attemptResponsePromise = fetchData(
    `/game/${game._id}/attempt`,
    "POST",
    {
      word: attemptLetters.join(""),
    }
  );

  const transformSquaresPromise = transformSquares(true).then(() => {
    // Show the loading overlay in case the response hasn't been received from the server.
    toggleKeyboardOverlay(true);
  });

  const [response] = await Promise.all([
    attemptResponsePromise,
    transformSquaresPromise,
  ]);

  toggleKeyboardOverlay(false);

  // An unhandled exception in the API threw a 500 internal server error.
  if (!response) {
    showMessage("An error occurred while attempting the word. Please try again.");
    setBlockKeyEvents(false);
    transformSquares(false, true);
    return;
  }

  if (response.gameData) {
    // Set up remote and local Game copies.
    const remoteGame = new Game(response.gameData);
    const localGame = new Game(game);

    // Add the most recent attempt to the local copy since remote copy will contain it.
    localGame.attempts.push(attemptLetters.join(""));

    const attemptsMatch = Array.from(remoteGame.attempts).every((a) =>
      localGame.attempts.includes(a)
    );

    if (response.statusCode === 200) {
      switch (true) {
        case localGame.attempts.length !== remoteGame.attempts.length: // attempt array size mismatch
        case !attemptsMatch || remoteGame.attempts.length !== localGame.attempts.length: // array element content mismatch
        case localGame._id !== remoteGame._id: // game id mismatch
        case localGame.word !== remoteGame.word: // game word mismatch
          logger.error(
            "There is a game data mismatch, reloading the game in 10 seconds..."
          );
          setTimeout(() => {
            storeSession("game", response.gameData);
            window.location.href = "/";
          }, 10000);
          return;
      }
      storeSession("game", response.gameData);
    }
  }
  await processAttemptResponse(game, response);
};

/**
 * Validates the attempt has enough letters, has not been tried before, and is a valid word from the word list.
 * If the word list is not found in local storage, it's retrieved from the server asynchronously for next time.
 *
 * @param {Game} game - The game to validate the attempt against.
 * @return {boolean} true if the attempt is valid, false otherwise.
 */
export const validateAttempt = (game) => {
  const attemptLetters = getAttemptLetters();
  const attemptWord = attemptLetters.join("");

  if (attemptLetters.length != game.word.length) {
    showMessage("Not enough letters");
    return false;
  }

  if (game.attempts.includes(attemptWord)) {
    showMessage("Word already tried");
    return false;
  }

  const wordList = retrieveLocal("wordList");
  if (wordList) {
    if (!wordExists(attemptWord)) {
      showMessage("Not in word list");
      return false;
    }
  } else {
    logger.info("No word list found locally, fetching in the background...");
    fetchWordList(game.word.length)
      .then((response) => {
        storeLocal("wordList", response);
        logger.info(`Stored ${response.length} words in the wordList.`);
      })
      .catch((error) => logger.error("Error fetching word list", error));
  }
  return true;
};

/**
 * Returns the stack of letters in the current attempt word.
 */
export const getAttemptLetters = () => attemptLetters;
export const clearAttemptLetters = () => (attemptLetters = []);