import {
  fillNextSquare,
  removeLastSquareValue,
} from "./gameboard.service.js";
import { forfeitGame, startGame } from "./game.service.js";
import { processAttempt } from "./attempt.service.js";
import { getCurrentViewName, showView, viewHistory } from "../utils/helpers.js";
import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "../constants.js";
import { authenticate, register } from "./authentication.service.js";
import { showMessage } from "./message.service.js";

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
  // Pop the previous view name from the view history stack.
  const previousView = viewHistory.pop();
  showView(previousView, {
    ignoreAddToHistory: true,
  });
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
  const email = document.querySelector("#email")?.value;
  const password = document.querySelector("#password")?.value;
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Make sure the email doesn't have any invalid characters
  if (!emailRegex.test(email)) {
    showMessage("Invalid e-mail address format.", false);
    return;
  }
  
  authenticate(email, password);
};

/**
 * TODO: handle logic for registration
 */
export const clickRegisterButton = () => {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");
  const usernameInput = document.querySelector("#username");

  if (!emailInput || !passwordInput || !confirmPasswordInput || !usernameInput) {
    showMessage("Please check all form values and try again.", false);
    return;
  }

  const usernameRegex = /^[a-zA-Z0-9 _-]{3,16}$/;
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(emailInput.value)) {
    showMessage("Email is not a valid email address.", false)
    emailInput.classList.add("error");
    return;
  } else {
    emailInput.classList.remove("error");
  }

  if (!usernameRegex.test(usernameInput.value)) {
    showMessage("Username must be 3-16 characters long.\r\nA-z, numbers, hyphen, underscore, spaces only.", false);
    usernameInput.classList.add("error");
    return;
  } else {
    usernameInput.classList.remove("error");
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    showMessage("Passwords do not match.", false);
    passwordInput.classList.add("error");
    confirmPasswordInput.classList.add("error");
    return;
  } else {
    passwordInput.classList.remove("error");
    confirmPasswordInput.classList.remove("error");
  }

  register(emailInput.value, usernameInput.value, passwordInput.value);
};

export const clickLoginMessage = (event) => {
  const targetId = event.target.id;
  if (!targetId) return;

  if (targetId === "loginButton") {
    showView("login");
  } else if (targetId === "registerButton") {
    showView("register");
  } else if (targetId === "forgotPasswordButton") {
    showView("change-password");
  } else {
    console.log("Unknown event target:", targetId);
  }
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
