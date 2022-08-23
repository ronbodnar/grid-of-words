import { setBlockKeyEvents } from "../../shared/services/event.service.js";
import { showMessage } from "../../shared/services/message.service.js";
import { removeSession } from "../../shared/services/storage.service.js";
import {
  shiftActiveRow,
  transformSquares,
  updateCurrentAttemptSquares,
} from "../gameboard/gameboard.service.js";
import { updateKeyboardKeys } from "../keyboard/keyboard.service.js";
import { showView } from "../view/view.service.js";
import { clearAttemptLetters, getAttemptLetters } from "./attempt.service.js";

/**
 * Processes the response based on the message content, then displays the message.
 *
 * @param {Game} game - The current game object.
 * @param {object} data - The response data from the server.
 */
export const processAttemptResponse = async (game, data) => {
  let message = "Error";

  if (!data) {
    showMessage("No response from server", {
      className: "error",
    });
    return;
  }

  if (data.message) {
    switch (data.message) {
      case "WRONG_WORD":
        updateCurrentAttemptSquares(game.word);

        await transformSquares(false);

        updateKeyboardKeys(game.word, getAttemptLetters());

        shiftActiveRow();

        clearAttemptLetters();
        message = "";

        setBlockKeyEvents(false);
        break;

      case "WINNER":
      case "LOSER":
        removeSession("game");
        if (data.message === "LOSER") {
          message = data.gameData.word.toUpperCase();
        } else {
          message = data.message;
        }
        updateCurrentAttemptSquares(game.word);
        await transformSquares(false);
        clearAttemptLetters();
        setTimeout(() => {
          setBlockKeyEvents(false);
          showView("home");
        }, 3000);
        break;

      case "GAME_NOT_FOUND":
        showView("home", {
          message: {
            text: "The game could not be found. Please start a new game.",
            hideDelay: 5000,
            className: "error",
          }
        });
        return; // Return early so the message is not overwritten.

      // Edge cases to handle gracefully
      case "NO_WORD_OR_NO_ID":
      case "ATTEMPTS_EXCEEDED":
      case "WORD_LENGTH_MISMATCH":
      case "ADD_ATTEMPT_REPOSITORY_ERROR":

      // Only ones that are handled as of now.
      case "NOT_IN_WORD_LIST":
      case "DUPLICATE_ATTEMPT":
      default:
        message =
          data.message.at(0).toUpperCase() +
          data.message.slice(1).toLowerCase().replaceAll("_", " ");

        await transformSquares(false, true);

        setBlockKeyEvents(false);
        break;
    }
  } else {
    console.error("No message found in data", data);
  }

  // Update the response message element
  showMessage(message);
};
