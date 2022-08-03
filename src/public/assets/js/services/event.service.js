import {
  fillNextSquare,
  removeLastSquareValue,
} from "./gameboard.service.js";
import { forfeitGame, startGame } from "./game.service.js";
import { processAttempt } from "./attempt.service.js";
import { getCurrentViewName, showView } from "../utils/helpers.js";
import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "../constants.js";
import { authenticate } from "./authentication.service.js";

// When we are performing certain tasks, we don't want to accept user input and block it conditionally.
let blockKeyEvents = false;

/**
 * Add event listeners for global key press events.
 */
export const addKeyListeners = () => {
  // Keypress only listens for keys that emit a value
  document.addEventListener("keypress", function (event) {
    if (blockKeyEvents) return;

    const key = event.key;

    if (key === "Enter") {
      if (getCurrentViewName() === "home") {
        clickStartGameButton();
        return;
      }
      processAttempt();
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

/**
 * Handles the event when a user taps a key on the on-screen keyboard.
 *
 * @param {string} letter The letter entered by the user.
 */
export const clickKeyboardKey = (letter) => {
  console.log(letter);
  if (isBlockKeyEvents()) return;

  if (letter === "delete") {
    removeLastSquareValue();
    return;
  }

  if (letter === "enter") {
    processAttempt();
    return;
  }

  fillNextSquare(letter);
};

/**
 * Prompts the user if they'd like to forfeit, then forfeits or closes depending on the user's choice.
 */
export const clickForfeitGameButton = async () => {
  if (window.confirm("Are you sure you want to forfeit the game?"))
    await forfeitGame();
};

/**
 * Begins a new game.
 */
export const clickStartGameButton = (
  event, // required parameter since we are using additional parameters with the event listener callback
  wordLength = DEFAULT_WORD_LENGTH,
  maxAttempts = DEFAULT_MAX_ATTEMPTS
) => {
  startGame({
    wordLength: wordLength,
    maxAttempts: maxAttempts,
    language: "enUS",
  });
};

/**
 * Shows the home view when the user clicks the back button element generated in views.
 */
export const clickBackButton = () => {
  showView("home");
};

/**
 * Shows the options view when the user clicks the options button.
 */
export const clickOptionsButton = () => {
  showView("options");
};

/**
 * Shows the how to play view when the user clicks the how to play button.
 */
export const clickHowToPlayButton = () => {
  showView("how-to-play");
};

/**
 * Tries to authenticate with the server using the input username and password.
 */
export const clickLoginButton = () => {
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  authenticate(username?.value, password?.value);
};

/**
 * TODO: handle logic for registration
 */
export const clickRegisterButton = () => {
  console.log("Register clicked");
};

export const clickLoginMessage = (event) => {
  const targetId = event.target.id;
  if (!targetId) return;

  if (targetId === "loginButton") {
    showView("login");
  }
  console.log(event);
}

/**
 * Enable or disable the blocking of key events during animations.
 *
 * @param {boolean} block - True to block key events, false to allow them.
 */
export const setBlockKeyEvents = (block) => {
  blockKeyEvents = block;
};

/**
 * Checks whether or not key events are being blocked.
 *
 * @return {boolean} true if events are being blocked, otherwise false.
 */
export const isBlockKeyEvents = () => {
  return blockKeyEvents;
};
