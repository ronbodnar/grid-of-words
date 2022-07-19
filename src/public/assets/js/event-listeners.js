import {
  fillNextSquare,
  removeLastSquareValue,
} from "./components/board/square.js";
import { forfeitGame, startGame } from "./services/game.service.js";
import { retrieve } from "./services/storage.service.js";
import { attempt, getAttemptLetters } from "./services/attempt.service.js";
import { getCurrentViewName } from "./utils/helpers.js";
import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "./constants.js";

var isKeyPressed = false;
var blockKeyEvents = false;

/*
 * Bootstraps the button event listeners
 */
const addButtonListeners = () => {
  const startGameButton = document.querySelector("#quick-game");
  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      return startGame({
        wordLength: DEFAULT_WORD_LENGTH,
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        timed: false,
        language: "enUS",
      });
    });
  }
};

/*
 * Bootstrap the key event listeners
 */
const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (blockKeyEvents || isKeyPressed) return;

    const key = event.key;

    // causes input to be blocked when you type fast
    //isKeyPressed = true;

    // Enter should be blocked, but if there are no squares available (word is complete), let the server know.
    // TODO: debouncing
    if (key === "Enter") {
      if (getCurrentViewName() === "home") {
        startGame({
          wordLength: DEFAULT_WORD_LENGTH,
          maxAttempts: DEFAULT_MAX_ATTEMPTS,
          timed: false,
          language: "enUS",
        });
        return;
      }
      const game = retrieve("game")?.data;
      if (game) {
        var lengthMatches = getAttemptLetters().length === game.word.length;
        console.log(getAttemptLetters().length, game.word.length);
        if (lengthMatches) attempt(game);
      } else {
        console.error("No game found");
      }
      return;
    }

    fillNextSquare(key);
  });

  // Keydown is for non-value keys as well
  document.addEventListener("keydown", function (event) {
    if (blockKeyEvents || isKeyPressed) return;

    const key = event.key;

    if (key === "Delete" || key === "Backspace") removeLastSquareValue(key);
  });

  document.addEventListener("keyup", function (event) {
    isKeyPressed = false;
  });
};

/*
 * Initialize the event listeners
 */
const initialize = () => {
  addKeyListeners();
  addButtonListeners();
};

/*
 * Enable or disable the blocking of key events during animations.
 * @param {boolean} block - True to block key events, false to allow them.
 */
const setBlockKeyEvents = (block) => {
  blockKeyEvents = block;
};

const shouldBlockKeyEvents = () => {
  return blockKeyEvents;
};

export { initialize, setBlockKeyEvents, shouldBlockKeyEvents };
