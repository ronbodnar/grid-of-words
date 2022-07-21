import { shiftActiveRow } from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showView } from "../utils/helpers.js";
import { updateKeyboardKeys } from "../components/keyboard/on-screen-keyboard.js";

var attemptLetters = [];

const hideSquares = (hide) => {
  const activeRow = document.querySelector(".word-row.active");
  const children = Array.from(activeRow?.children);
  return new Promise((resolve) => {
    for (let i = 0; i < children.length; i++) {
      setTimeout(() => {
        children[i].children[0].style.opacity = hide ? "0" : "1";
        if (i === children.length - 1) {
          setTimeout(() => resolve(true), 1000);
        }
      }, i * 300);
    }
  });
};

/*
 * Attempts to solve the puzzle by querying the API and updating the game container accordingly.
 */
const attempt = async (game) => {
  //var response = await getAttemptResponse(game);

  const valid = validateAttempt(game);
  console.log("Valid? ", (valid ? "yes" : "no"));
  if (!valid) {
    return;
  }

  var data = await getAttemptResponse(game);

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
        // Block key events
        setBlockKeyEvents(true);

        
        await hideSquares(true);

        // Display the letter position validations
        updateCurrentAttemptSquares(game.word);

        await hideSquares(false);

        updateKeyboardKeys(game.word, attemptLetters);

        // Move active squares down
        shiftActiveRow();
        attemptLetters = [];
        message = "";

        setBlockKeyEvents(false);
        break;

      case "WINNER":
      case "LOSER":
        await hideSquares(true);
        remove("game");

        if (data.message === "LOSER") {
          message = data.gameData.word.toUpperCase();
        } else {
          message = data.message;
        }

        // Block events while updating the current attempt results
        setBlockKeyEvents(true);
        updateCurrentAttemptSquares(game.word);
        setBlockKeyEvents(false);
        await hideSquares(false);
        attemptLetters = [];

        setTimeout(() => {
          showView("home");
        }, 5000);

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

  updateMessageDiv(message);
};

const validateAttempt = (game) => {
  const attemptLetters = getAttemptLetters();
  if (attemptLetters.length != game.word.length) {
    updateMessageDiv("Add More CHARS!!!!.");
    return false;
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

var messageTimeout = undefined;

const updateMessageDiv = (message) => {
  if (message.length < 1) return;

  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) messageDiv.textContent = message;

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout);

  // Add the timeout to hide the message after 5 seconds.
  messageTimeout = setTimeout(() => {
    messageDiv.textContent = "";
  }, 2500);
};

export { attempt, getAttemptLetters };
