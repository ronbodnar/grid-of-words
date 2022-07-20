import { getValidatedLetters } from "../../utils/helpers.js";
import { buildKeyElement } from "./key.js";

let keyboardKeys = {};

/*
 * Gets the rendered keyboard element.
 * @param {Game} game - The game to render the keyboard for.
 */
const buildOnScreenKeyboard = (game) => {
  let rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
  ];

  initializeKeyboardKeys(game);

  let keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");

  for (let i = 0; i < rows.length; i++) {
    let row = document.createElement("div");
    row.classList.add("keyboard-row");

    for (let j = 0; j < rows[i].length; j++) {
      let key = getKeyboardKey(rows[i][j]);

      row.appendChild(key);
    }
    keyboard.appendChild(row);
  }

  return keyboard;
};

const initializeKeyboardKeys = (game) => {
  console.log("initialize keys: ", game);
  const incorrectLetters = game === undefined ? undefined : getIncorrectLetters(game.word, game.attempts);

  // Add enter and delete keys
  let enterKey = buildKeyElement("enter", false);
  enterKey.classList.add("enter-key");
  keyboardKeys["enter"] = enterKey;

  let deleteKey = buildKeyElement("delete", false);
  deleteKey.classList.add("delete-key");
  deleteKey.innerHTML = '<span class="material-symbols-outlined">backspace</span>';
  keyboardKeys["delete"] = deleteKey;

  // Add a-z keys
  for (let i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    let key = buildKeyElement(letter, incorrectLetters ? incorrectLetters.includes(letter) : false);
    keyboardKeys[letter] = key;
  }
};

const updateKeyboardKeys = (gameWord, attemptedWord) => {
  const incorrectLetters = getIncorrectLetters(gameWord, [attemptedWord]);
  incorrectLetters.forEach((letter) => {
    const key = getKeyboardKey(letter);
    key?.classList.add("incorrect");
  });
};

const getKeyboardKey = (char) => {
  return keyboardKeys[char];
};

/*
 * Finds a list of letters that are not included in the correct word of the game.
 * Is this the best you can do?
 * @param {Game} game - The game to search attempts for.
 */
const getIncorrectLetters = (gameWord, attemptedWords) => {
  let incorrectLetters = [];

  for (let i = 0; i < attemptedWords.length; i++) {
    let guessWord = attemptedWords[i];
    const results = getValidatedLetters(guessWord, gameWord);
  }

  console.log(attemptedWords);
  for (let i = 0; i < attemptedWords.length; i++) {
    let attempt = attemptedWords[i];
    for (let j = 0; j < attempt.length; j++) {
      if (!gameWord.includes(attempt.at(j))) {
        if (!incorrectLetters.includes(attempt.at(j))) {
          incorrectLetters.push(attempt.at(j));
        }
      }
    }
  }
  return incorrectLetters;
};

export { buildOnScreenKeyboard, updateKeyboardKeys, getKeyboardKey, getIncorrectLetters };