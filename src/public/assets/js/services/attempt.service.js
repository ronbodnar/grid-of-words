import { shiftActiveRow, transformSquares } from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, retrieve, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showView } from "../utils/helpers.js";
import { updateKeyboardKeys } from "../components/keyboard/on-screen-keyboard.js";
import { showMessage } from "./message.service.js";
import { wordExists } from "./word.service.js";

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

  // The hiding squares promise, we are going to immediate fetch the data so we don't want to perform this synchronously (it's awaited later)
  const hidingSquares = transformSquares(true).then(() => {
    console.log("done here");
  });

  // Fetch the attempt response from the server
  var data = await getAttemptResponse(game);
  console.log("Attempt response: ", data);

  // Wait for squares to hide before continuing
  await hidingSquares;

  // Update gamedata local storage
  if (data.gameData) {
    store("game", data.gameData);
    if (data.gameData.word !== game.word) {
      console.error("Modified word detected");
    }
  }

  // Update the game data in the local storage.
  if (data && data.gameData) store("game", data.gameData);

  // Process the response from the server.
  await processServerResponse(game, data);
};

const processServerResponse = async (game, data) => {
  var message = "Error";

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

  const wordList = retrieve("wordList")?.data;
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
