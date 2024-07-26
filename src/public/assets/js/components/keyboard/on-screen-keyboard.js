import { getValidatedLetters } from "../../utils/helpers.js";
import { getLoader } from "../loader.js";
import { buildKeyElement } from "./key.js";
import { getLetterStates } from "../../utils/helpers.js";
import { EXACT_MATCH, NO_MATCH, PARTIAL_MATCH } from "../../constants.js";

let keyboardKeys = {};

/*
 * Gets the rendered keyboard element.
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

  const loading = getLoader();
  loading.classList.add("keyboard-loading");

  overlay.appendChild(loading);

  keyboard.appendChild(overlay);
  keyboard.appendChild(keys);

  return keyboard;
};

/*
 *
 */
const initializeKeyboardKeys = (game) => {
  let letterStates;
  if (game) letterStates = getLetterStates(game.word, game.attempts);

  // Add enter and delete keys
  let enterKey = buildKeyElement("enter", false);
  enterKey.classList.add("enter-key");
  keyboardKeys["enter"] = enterKey;

  let deleteKey = buildKeyElement("delete", false);
  deleteKey.classList.add("delete-key");
  keyboardKeys["delete"] = deleteKey;

  // Add a-z keys
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    let key = buildKeyElement(
      letter,
      letterStates ? letterStates[letter] : undefined
    );
    keyboardKeys[letter] = key;
  }
};

/*
 * Updates the keyboard keys background colors to their match states.
 * @param {string} gameWord - The current game word.
 * @param {string} attemptWord - The current attempt word.
 */
export const updateKeyboardKeys = (gameWord, attemptedWord) => {
  const letterStates = getLetterStates(gameWord, [attemptedWord]);
  console.log(letterStates);
  for (let i = 0; i < attemptedWord.length; i++) {
    const letter = attemptedWord.at(i);
    const key = getKeyboardKey(letter, letterStates[letter]);
    if (!key) {
      console.error(`No key found for letter ${letter}`);
      continue;
    }
    switch (letterStates[letter]) {
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

/*
 * Gets the key element for the given letter.
 * @param {string} char - The letter of the key element to find.
 */
export const getKeyboardKey = (char) => {
  return keyboardKeys[char];
};

export const toggleKeyboardOverlay = () => {
  const overlay = document.querySelector(".keyboard-overlay");
  overlay.classList.toggle("hidden");
  console.log(
    `Keyboard overlay is now ${overlay.classList.contains("hidden")}!`
  );
};
