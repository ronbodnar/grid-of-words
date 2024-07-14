import { attempt, getAttemptLetters } from "./services/attempt.service.js";
import { startGame } from "./services/game.service.js";
import { retrieve } from "./services/storage.service.js";

var blockKeyEvents = false;

/*
 * Bootstraps the button event listeners
 */
const addButtonListeners = () => {
  const startGameButton = document.querySelector("#quickGame");
  if (startGameButton) {
    startGameButton.addEventListener("click", startGame);
  }
};

/*
 * Bootstrap the key event listeners
 */
const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (blockKeyEvents) return;
    const key = event.key;

    // Block any key input that isnt an alpha character
    if (/[^a-zA-Z]/.test(key)) {
      console.log("Invalid key:", key);
      return;
    }

    // Find all available squares (active is set by the server)
    var squares = document.querySelectorAll(".square:is(.active):not(.full)");

    // Enter should be blocked, but if there are no squares available (word is complete), let the server know.
    if (key === "Enter") {
      if (!squares[0]) {
        const game = retrieve("game").data;
        if (game)
          attempt(game);
        //TODO: error handling
        else console.error("No game found")
      }
      return;
    }

    // Ensure there's a square available, update the square properties, and add it to our stack of letters.
    if (squares[0]) {
      squares[0].classList.add("full");
      squares[0].children[0].innerHTML = key.toUpperCase();
      getAttemptLetters().push(key);
    }
  });

  // Keydown is for non-value keys as well
  document.addEventListener("keydown", function (event) {
    if (blockKeyEvents) return;
    const key = event.key;

    // Find all available squares (active is set by the server)
    var squares = document.querySelectorAll(".square:is(.active):is(.full)");

    // If there are letters, adjust the square properties and remove the pop the letter off the stack of letters.
    if (key === "Backspace" || key === "Delete") {
      // Remove the last letter in the stack of attempt letters.
      if (getAttemptLetters().length > 0) {
        squares[getAttemptLetters().length - 1].classList.remove("full");
        squares[getAttemptLetters().length - 1].children[0].innerHTML = "";
        getAttemptLetters().pop();
      }
    }
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
}

export { initialize, setBlockKeyEvents };