import { shiftActiveRow } from "../components/board/gameboard.js";
import { setBlockKeyEvents } from "../event-listeners.js";
import { remove, store } from "./storage.service.js";
import { updateCurrentAttemptSquares } from "../components/board/square.js";
import { showContainerView } from "../utils/helpers.js";
import { updateKeyboardKeys } from "../components/keyboard/key.js";

var attemptLetters = [];

/*
 * Attempts to solve the puzzle by querying the API and updating the game container accordingly.
 */
const attempt = async (game) => {
  console.log("attempt");
  var data = await getAttemptResponse(game);

  // Update the localStorage game
  if (data && data.gameData) store("game", data.gameData);

  var message = "Error";

  // Handle responses from the server
  if (data.message) {
    switch (data.message) {
      case "NO_WORD_OR_NO_ID":
      case "GAME_NOT_FOUND":
      case "ATTEMPTS_EXCEEDED":
      case "DUPLICATE_ATTEMPT":
      case "NOT_IN_WORD_LIST":
      case "WORD_LENGTH_MISMATCH":
      case "ADD_ATTEMPT_REPOSITORY_ERROR":
        // Edge cases
        message =
          data.message.at(0).toUpperCase() +
          data.message.slice(1).toLowerCase().replaceAll("_", " ");
        break;

      case "WRONG_WORD":
        // Block key events
        setBlockKeyEvents(true);

        // Display the letter position validations
        updateCurrentAttemptSquares(game.word);
        updateKeyboardKeys(game.word, attemptLetters);

        // Move active squares down
        shiftActiveRow();
        attemptLetters = [];
        message = "Wrong word";

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

        // Block events while updating the current attempt results
        setBlockKeyEvents(true);
        updateCurrentAttemptSquares(game.word);
        setBlockKeyEvents(false);
        attemptLetters = [];

        setTimeout(() => {
          showContainerView('home');
        }, 5000);

        // Display stats and change container view
        break;
    }
  }

  console.log("Attempt response: ", data);
  console.log("Message:", message);

  updateMessageDiv(message);
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

var messageTimeout = undefined;

const updateMessageDiv = (message) => {
  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) messageDiv.textContent = message;

  if (messageTimeout)
    clearTimeout(messageTimeout);
  
  // Add the timeout to hide the message after 5 seconds.
  messageTimeout = setTimeout(() => {
    messageDiv.textContent = "";
  }, 5000);
}

export { attempt, getAttemptLetters };
