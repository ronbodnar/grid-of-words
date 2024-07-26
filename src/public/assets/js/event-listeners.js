import {
  fillNextSquare,
  removeLastSquareValue,
} from "./components/board/gameboard.js";
import { startGame } from "./services/game.service.js";
import { retrieve } from "./services/storage.service.js";
import { attempt } from "./services/attempt.service.js";
import { getCurrentViewName } from "./utils/helpers.js";
import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "./constants.js";
import { toggleKeyboardOverlay } from "./components/keyboard/on-screen-keyboard.js";

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
        language: "enUS",
      });
    });
  }
};

/*
 * Bootstrap the key event listeners
 */
const addKeyListeners = () => {
  let timeout;

  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (blockKeyEvents) return;

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
          language: "enUS",
        });
        return;
      }
      const game = retrieve("game")?.data;
      if (game) {
        attempt(game);
      } else {
        console.error("No game found");
      }
      return;
    }

    fillNextSquare(key);
  });

  // Keydown is for non-value keys as well
  document.addEventListener("keydown", function (event) {
    if (blockKeyEvents) return;

    const key = event.key;

    if (key === "Delete" || key === "Backspace") removeLastSquareValue(key);
  });
};

/*
 * Initialize the event listeners
 */
export const initialize = () => {
  addKeyListeners();
  addButtonListeners();
};

/*
 * Enable or disable the blocking of key events during animations.
 * @param {boolean} block - True to block key events, false to allow them.
 */
export const setBlockKeyEvents = (block) => {
  blockKeyEvents = block;
};

export const isBlockKeyEvents = () => {
  return blockKeyEvents;
};
