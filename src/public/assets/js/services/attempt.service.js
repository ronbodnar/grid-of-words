import {
  shiftActiveRow,
  transformSquares,
} from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, retrieve, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showView } from "../utils/helpers.js";
import {
  toggleKeyboardOverlay,
  updateKeyboardKeys,
} from "../components/keyboard/on-screen-keyboard.js";
import { showMessage } from "./message.service.js";
import { wordExists } from "./word.service.js";
import { Game } from "../models/Game.class.js";

var attemptLetters = [];

/*
 * Attempts to solve the puzzle by querying the API and updating the game container accordingly.
 */
const attempt = async (game) => {
  // Block key events
  setBlockKeyEvents(true);

  // Check to see if there's any validation errors we can handle on the client side before making a request to the server.
  const valid = validateAttempt(game);
  if (!valid) {
    setBlockKeyEvents(false);
    return;
  }

  // Fetch the attempt response from the server
  const attemptResponsePromise = getAttemptResponse(game)

  // Wait for squares to hide before continuing
  const transformSquaresPromise = transformSquares(true).then(() => {
    // Show the loading overlay in case the response hasn't been received from the server.
    toggleKeyboardOverlay(true);
  });

  // Wait for both promises to complete
  const [response] = await Promise.all([
    attemptResponsePromise,
    transformSquaresPromise,
  ]);

  // Handling of other responses without gameData
  console.log("Attempt response: ", response);

  // Hide the keyboard overlay
  toggleKeyboardOverlay(false);

  // Check to see if the game data we have is aligned with the server, if not, refresh the page.
  if (response.gameData) {
    const remoteGame = new Game(response.gameData);
    if (remoteGame.attempts.length > 1) // If there is zero or one attempt (duplicate word), don't pop it.
      remoteGame.attempts.pop(); // Remove the current attempt that we just made for comparison.

    // If there are property mismatches, we need to refresh to force-update with the good data.
    console.log(game);
    console.log(remoteGame);
    
    if (!game.equals(remoteGame)) {
      //store("game", response.gameData);
      //window.location.href = "/";
      console.log("Game Mismatch", game, remoteGame);
      return;
    }

    // Update the local version of the game.
    //store("game", response.gameData);
  }

  // Process the response from the server.
  await processServerResponse(game, response);
};

/*
 * Posts the attempt to the API and waits for the response.
 * @param {Game} game - The current game object.
 * @return {json} - The JSON response from the API.
 */
const getAttemptResponse = async (game) => {
  return fetch(`/game/${game.id}/attempts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      word: attemptLetters.join(""),
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

const processServerResponse = async (game, data) => {
  var message = "Error";

  if (!data) {
    showMessage("No response from server");
    return;
  }

  if (data.message) {
    switch (data.message) {
      // Edge cases
      case "NO_WORD_OR_NO_ID":
      case "GAME_NOT_FOUND":
      case "ATTEMPTS_EXCEEDED":
      case "WORD_LENGTH_MISMATCH":
      case "ADD_ATTEMPT_REPOSITORY_ERROR":

      // Only ones that are handled as of now
      case "NOT_IN_WORD_LIST":
      case "DUPLICATE_ATTEMPT":
        message =
          data.message.at(0).toUpperCase() +
          data.message.slice(1).toLowerCase().replaceAll("_", " ");
        break;

      case "WRONG_WORD":
        console.log("starting");
        // Display the letter position validations
        updateCurrentAttemptSquares(game.word);

        updateKeyboardKeys(game.word, attemptLetters);

        await transformSquares(false);

        // Move active squares down
        shiftActiveRow();
        attemptLetters = [];
        message = "";

        setBlockKeyEvents(false);
        break;

      case "WINNER":
      case "LOSER":
        remove("game");
        if (data.message === "LOSER") {
          message = data.gameData.word.toUpperCase();
        } else {
          message = data.message;
        }

        updateCurrentAttemptSquares(game.word);

        await transformSquares(false);
        attemptLetters = [];

        setTimeout(() => {
          setBlockKeyEvents(false);
          showView("home");
        }, 3500);
        break;
    }
  }

  showMessage(message);
};

const validateAttempt = (game) => {
  // Check to see if the attempt has enough letters
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

  const wordList = retrieve("wordList");
  if (!wordList) {
    // re-fetch word list synchronously? pass to server for validation while asynchronously fetching the word list?
  } else {
    console.log("WORD LIST:", wordList);
    console.log("Attempted Word:", attemptWord);
    if (!wordExists(attemptWord)) {
      showMessage("Not in word list");
      return false;
    }
  }
  return true;
};

/*
 * Returns the stack of letters in the current attempt word.
 */
const getAttemptLetters = () => {
  return attemptLetters;
};

export { attempt, getAttemptLetters };
