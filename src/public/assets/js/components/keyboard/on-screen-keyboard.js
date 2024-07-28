import { buildLoadingElement } from "../loading.js";
import { buildKeyElement } from "./key.js";
import { getLetterStates } from "../../utils/helpers.js";
import { EXACT_MATCH, NO_MATCH, PARTIAL_MATCH } from "../../constants.js";

let keyboardKeys = {};

/**
 * Builds the on screen keyboard container and all children.
 *
 * @param {Game} game - The game to render the keyboard for.
 */
export const buildOnScreenKeyboard = (game) => {
  let rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
  ];

  initializeKeyboardKeys(game);

  let keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");

  const keys = document.createElement("div");
  keys.classList.add("keyboard-keys");

  for (let i = 0; i < rows.length; i++) {
    let row = document.createElement("div");
    row.classList.add("keyboard-row");

    for (let j = 0; j < rows[i].length; j++) {
      let key = getKeyboardKey(rows[i][j]);

      row.appendChild(key);
    }
    keys.appendChild(row);
  }

  // Set up the loading overlay for the keyboard
  const overlay = document.createElement("div");
  overlay.classList.add("keyboard-overlay", "hidden");

  const loading = buildLoadingElement();
  loading.classList.add("keyboard-loading");

  overlay.appendChild(loading);

  keyboard.appendChild(overlay);
  keyboard.appendChild(keys);

  return keyboard;
};

/**
 * Initializes the keyboardKeys object by building key elements for A-Z, enter, and delete keys.
 *
 * @param {Game} game - The game to fetch letter match states for.
 */
const initializeKeyboardKeys = (game) => {
  // If no game is specified, don't fetch the letter match states.
  const letterStates = game
    ? getLetterStates(game.word, game.attempts)
    : undefined;

  // Create the enter key and add it to the keyboardKeys object.
  let enterKey = buildKeyElement("enter", false);
  enterKey.classList.add("enter-key");
  keyboardKeys["enter"] = enterKey;

  // Create the delete key and add it to the keyboardKeys object.
  let deleteKey = buildKeyElement("delete", false);
  deleteKey.classList.add("delete-key");
  keyboardKeys["delete"] = deleteKey;

  // Create the keys for A-Z and add them to the keyboardKeys object.
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    keyboardKeys[letter] = buildKeyElement(letter, letterStates);
  }
};

/**
 * Updates the keyboard keys background colors to their match states.
 * @param {string} gameWord - The current game word.
 * @param {string} attemptWord - The current attempt word.
 */
export const updateKeyboardKeys = (gameWord, attemptedWord) => {
  const letterMatchStates = getLetterStates(gameWord, [attemptedWord]);

  // Iterate the letters in the attempted word.
  for (let i = 0; i < attemptedWord.length; i++) {
    const letter = attemptedWord.at(i);
    const key = getKeyboardKey(letter, letterMatchStates[letter]);

    // The key element could not be found.
    if (!key) {
      console.error(`No key found for letter ${letter}`);
      continue;
    }

    // Update the key's background color based on its match state.
    switch (letterMatchStates[letter]) {
      case EXACT_MATCH:
        if (key.classList.contains("partial")) {
          key.classList.remove("partial");
        }
        key.classList.add("exact");
        break;

      case PARTIAL_MATCH:
        if (!key.classList.contains("exact")) {
          key.classList.add("partial");
        }
        break;

      case NO_MATCH:
        if (
          !key.classList.contains("exact") &&
          !key.classList.contains("partial")
        ) {
          key.classList.add("incorrect");
        }
        break;
    }
  }
};

/**
 * Toggles the keyboard overlay, or sets it to visible/hidden if specified.
 *
 * @param {boolean} visible - Whether the overlay should be visible.
 */
export const toggleKeyboardOverlay = (visible) => {
  const overlay = document.querySelector(".keyboard-overlay");
  if (!overlay) return;
  if (visible != null && visible) {
    overlay.classList.remove("hidden");
  } else if (visible != null && !visible) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.toggle("hidden");
  }
};

/**
 * Gets the key element for the given letter.
 *
 * @param {string} char - The letter of the key element to find.
 */
export const getKeyboardKey = (char) => {
  return keyboardKeys[char];
};
