import { shiftActiveRow } from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, retrieve, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showView } from "../utils/helpers.js";
import { updateKeyboardKeys } from "../components/keyboard/on-screen-keyboard.js";
import { showMessage } from "./message.service.js";
import { wordExists } from "./word.service.js";

var attemptLetters = [];

const hideSquares = (hide) => {
  const activeRow = document.querySelector(".word-row.active");
  const children = Array.from(activeRow?.children);
  return new Promise((resolve) => {
    for (let i = 0; i < children.length; i++) {
      setTimeout(() => {
        children[i].children[0].style.opacity = hide ? "0" : "1";
        if (i === children.length - 1) {
          resolve(true);
        }
      }, (i === 0 ? i : i * 300));
    }
  });
};

/*
 * Attempts to solve the puzzle by querying the API and updating the game container accordingly.
 */
const attempt = async (game) => {
  // Check to see if there's any validation errors we can handle on the client side before making a request to the server.
  const valid = validateAttempt(game);
  console.log("Valid? ", (valid ? "yes" : "no"));
  if (!valid) {
    return;
  }
  
  // Block key events
  setBlockKeyEvents(true);

  // The hiding squares promise, we are going to immediate fetch the data so we don't want to perform this synchronously (it's awaited later)
  const hidingSquares = hideSquares(true).then(() => {
    console.log("done here");
  })

  var data = await getAttemptResponse(game);

  // Wait for squares to hide before continuing
  await hidingSquares;
  
  if (data.gameData) {
    store("game", data.gameData);
    if (data.gameData.word !== game.word) {
      console.error("Modified word detected")
    }
  }

  // Update the localStorage game
  if (data && data.gameData) store("game", data.gameData);

  var message = "Error";

  // Handle responses from the server
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

        await hideSquares(false);

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
        
        await hideSquares(false);
        attemptLetters = [];

        setTimeout(() => {
          setBlockKeyEvents(false);
          showView("home");
        }, 3500);

        // Display stats and change container view
        break;
    }
  }

  /*children.forEach(child => {
    if (child.classList.contains("hidden")) {
      child.classList.remove("hidden");
    } else {
      child.classList.add("hidden");
    }
  });*/

  console.log("Attempt response: ", data);
  console.log("Message:", message);

  showMessage(message);
};

const validateAttempt = (game) => {
  // Check to see if the attempt has enough letters
  const attemptLetters = getAttemptLetters();
  const attemptWord = attemptLetters.join('');
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
    // re-fetch word list synchronously? pass to server for validation while synchronously fetching the word list?
  } else {
    console.log("WORD LIST:", wordList);
    if (!wordExists(attemptWord)) {
      showMessage("Not in word list");
      return false;
    }
  }
  return true;
}

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
