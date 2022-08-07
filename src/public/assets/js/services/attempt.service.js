import { setBlockKeyEvents } from "./event.service.js";
import { removeSession, retrieveLocal, retrieveSession, storeLocal, storeSession } from "./storage.service.js";
import { showView } from "../utils/helpers.js";
import { showMessage } from "./message.service.js";
import { fetchWordList, wordExists } from "./word.service.js";
import { Game } from "../models/Game.class.js";
import {
  shiftActiveRow,
  transformSquares,
  updateCurrentAttemptSquares,
} from "./gameboard.service.js";
import {
  toggleKeyboardOverlay,
  updateKeyboardKeys,
} from "./keyboard.service.js";

// The list of letters that the user has entered for the current attempt.
let attemptLetters = [];

/**
 * Processes the attempt by querying the API and updating the game container accordingly.
 *
 * @param {Game} game - The game to process to attempt for.
 */
export const processAttempt = async (game) => {
  if (!game) {
    const game = retrieveSession("game");
    if (game) {
      processAttempt(game);
    } else {
      console.error("No game found");
    }
    return;
  }
  // Block key events.
  setBlockKeyEvents(true);

  // Check to see if there's any validation errors we can handle on the client side before making a request to the server.
  const valid = validateAttempt(game);
  if (!valid) {
    // Enable key events.
    setBlockKeyEvents(false);
    return;
  }

  // Fetch the attempt response from the server.
  const attemptResponsePromise = fetchAttemptResponse(game);

  // Wait for squares to hide before continuing.
  const transformSquaresPromise = transformSquares(true).then(() => {
    // Show the loading overlay in case the response hasn't been received from the server.
    toggleKeyboardOverlay(true);
  });

  // Wait for both promises to complete.
  const [response] = await Promise.all([
    attemptResponsePromise,
    transformSquaresPromise,
  ]);

  // Handling of other responses without gameData.
  console.log("Attempt response: ", response);

  // Hide the keyboard overlay
  toggleKeyboardOverlay(false);

  // We need to check the local and remote game objects to ensure we are working with the same data.
  if (response.gameData) {
    // Create a copy of the local game and push the new attempt.
    const localGame = new Game(game);
    localGame.attempts.push(attemptLetters.join(""));

    // Instantiate the remote game with the response data.
    const remoteGame = new Game(response.gameData);

    // Check if both games have the same number of attempts made.
    const attemptsMatch = Array.from(localGame.attempts).every((a) =>
      remoteGame.attempts.includes(a)
    );

    // If there are property mismatches, we need to refresh to force-update with the good data.
    switch (true) {
      case localGame.attempts.length !== remoteGame.attempts.length: // attempt array size mismatch
      case !attemptsMatch: // array element content mismatch
      case localGame.id !== remoteGame.id: // game id mismatch
      case localGame.word !== remoteGame.word: // game word mismatch
        console.error(
          "There is a game data mismatch, reloading the game in 3 seconds..."
        );
        setTimeout(() => {
          storeSession("game", response.gameData);
          window.location.href = "/";
        }, 3000);
        return;
    }

    // Update the local version of the game.
    storeSession("game", response.gameData);
  }

  // Process the response from the server.
  await processServerResponse(game, response);
};

/**
 * Posts the attempt to the API and waits for the response.
 * @param {Game} game - The current game object.
 * @return {json} - The JSON response from the API.
 */
const fetchAttemptResponse = async (game) => {
  return fetch(`/game/${game.id}/attempts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
    body: JSON.stringify({
      word: attemptLetters.join(""),
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error("Attempt Reponse failed: ", error));
};

/**
 * Processes the response based on the message content, then displays the message.
 *
 * @param {Game} game - The current game object.
 * @param {object} data - The response data from the server.
 */
const processServerResponse = async (game, data) => {
  var message = "Error";

  if (!data) {
    showMessage("No response from server");
    return;
  }

  if (data.message) {
    switch (data.message) {
      // Edge cases to handle gracefully
      case "NO_WORD_OR_NO_ID":
      case "GAME_NOT_FOUND":
      case "ATTEMPTS_EXCEEDED":
      case "WORD_LENGTH_MISMATCH":
      case "ADD_ATTEMPT_REPOSITORY_ERROR":

      // Only ones that are handled as of now.
      case "NOT_IN_WORD_LIST":
      case "DUPLICATE_ATTEMPT":
        // Proper case the message
        message =
          data.message.at(0).toUpperCase() +
          data.message.slice(1).toLowerCase().replaceAll("_", " ");
        break;

      case "WRONG_WORD":
        // Update the backgrounds of the squares depending on its validation status.
        updateCurrentAttemptSquares(game.word);

        // Bring the letter squares back into view one by one.
        await transformSquares(false);

        // Show the letter states on the keyboard after the squares have returned.
        updateKeyboardKeys(game.word, attemptLetters);

        // Move the active row down one.
        shiftActiveRow();

        // Clear properties.
        attemptLetters = [];
        message = "";

        // Enable key events again.
        setBlockKeyEvents(false);
        break;

      case "WINNER":
      case "LOSER":
        // Clear the game from local storage.
        removeSession("game");

        // Set up the resposne message.
        if (data.message === "LOSER") {
          message = data.gameData.word.toUpperCase();
        } else {
          message = data.message;
        }

        // Update the backgrounds of the squares depending on its validation status.
        updateCurrentAttemptSquares(game.word);

        // Bring the letter squares back into view one by one.
        await transformSquares(false);

        // Reinitialize the attempt letter array.
        attemptLetters = [];

        // Return to the home page after 3 seconds and enable key events again.
        setTimeout(() => {
          setBlockKeyEvents(false);
          showView("home");
        }, 3000);
        break;
    }
  }

  // Update the response message element
  showMessage(message);
};

/**
 * Validates the attempt by checking the following:
 * - The attempt has enough letters.
 * - The attempt has not been tried before.
 * - The attempt is a valid word from the word list.
 *
 * If the word list is not found in local storage, we retrieve it from the server for next time.
 * The server validates the attempt so we can safely pass a true return value.
 *
 * @param {Game} game - The game to validate the attempt against.
 * @return {boolean} true if the attempt is valid, false otherwise.
 */
export const validateAttempt = (game) => {
  const attemptLetters = getAttemptLetters();
  const attemptWord = attemptLetters.join("");

  console.log(`Validating attempt of "${attemptWord}" for game `, game);
  // Validate word length
  if (attemptLetters.length != game.word.length) {
    showMessage("Not enough letters");
    return false;
  }

  // Validate duplicate attempts
  if (game.attempts.includes(attemptWord)) {
    showMessage("Word already tried");
    return false;
  }

  // Validate word exists in word list.
  const wordList = retrieveLocal("wordList");
  if (!wordList) {
    // re-fetch word list synchronously? pass to server for validation while asynchronously fetching the word list?
    console.info("No word list found locally, fetching...");
    fetchWordList()
      .then((response) => {
        storeLocal("wordList", response);
        console.info(`Stored ${response.length} words in the wordList.`);
      })
      .catch((error) => console.error("Error fetching word list", error));
  } else {
    if (!wordExists(attemptWord)) {
      showMessage("Not in word list");
      return false;
    }
  }
  return true;
};

/**
 * Returns the stack of letters in the current attempt word.
 */
export const getAttemptLetters = () => {
  return attemptLetters;
};
