import { shiftActiveRow, transformSquares } from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, retrieve, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showView } from "../utils/helpers.js";
import { toggleKeyboardOverlay, updateKeyboardKeys } from "../components/keyboard/on-screen-keyboard.js";
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

  // Placeholder for the attemptResponsePromise results
  let data;

  // Fetch the attempt response from the server
  const attemptResponsePromise = getAttemptResponse(game).then((response) => {
    console.log("data response=", response);
    toggleKeyboardOverlay(false);
    data = response;
  });

  // Wait for squares to hide before continuing
  await transformSquares(true).then(() => {
    console.log("Finished transforming squares.");
  });

  // If we still haven't received the response, show the keyboard loading overlay and wait for the promise to resolve.
  if (!data) {
    toggleKeyboardOverlay(true);
    data = await attemptResponsePromise;
  }

  console.log("Attempt response: ", data);

  // Check to see if the game data we have is aligned with the server, if not, refresh the page.
  if (data?.gameData) { // Just in case data isn't available.. it happened one time somehow
    const remoteGame = new Game(data.gameData);
    remoteGame.attempts.pop(); // Remove the current attempt that we just made.
    if (!game.equals(remoteGame)) {
      store("game", data.gameData);
      window.location.href = '/';
      return;
    }

    store("game", data.gameData);
  }

  // Process the response from the server.
  await processServerResponse(game, data);
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
 * Posts the attempt to the API and waits for the response.
 * @param {Game} game - The current game object.
 * @return {json} - The JSON response from the API.
 */
const getAttemptResponse = async (game) => {
  const response = await fetch(`/game/${game.id}/attempts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: game.id,
      word: attemptLetters.join(""),
    }),
  });

  return await response.json();
};

/*
 * Returns the stack of letters in the current attempt word.
 */
const getAttemptLetters = () => {
  return attemptLetters;
};

export { attempt, getAttemptLetters };
