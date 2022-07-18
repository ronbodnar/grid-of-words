import { retrieve } from "../../services/storage.service.js";
import { shouldBlockKeyEvents } from "../../event-listeners.js";
import { attempt, getAttemptLetters } from "../../services/attempt.service.js";
import { fillNextSquare, removeLastSquareValue } from "../board/square.js";
import { getIncorrectLetters } from "./on-screen-keyboard.js";

var keyboardKeys = {};

const initializeKeyboardKeys = (game) => {
  console.log("initialize keys: ", game);
  const incorrectLetters = game === undefined ? undefined : getIncorrectLetters(game.word, game.attempts);

  // Add enter and delete keys
  var enterKey = buildKeyElement("enter", false);
  enterKey.classList.add("enter-key");
  keyboardKeys["enter"] = enterKey;

  var deleteKey = buildKeyElement("delete", false);
  deleteKey.classList.add("delete-key");
  deleteKey.innerHTML = '<span class="material-symbols-outlined">backspace</span>';
  keyboardKeys["delete"] = deleteKey;

  // Add a-z keys
  for (var i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    var key = buildKeyElement(letter, incorrectLetters ? incorrectLetters.includes(letter) : false);
    keyboardKeys[letter] = key;
  }
};

const buildKeyElement = (letter, incorrect) => {
  var key = document.createElement("div");
  key.textContent = letter.at(0).toUpperCase() + letter.substring(1);
  key.classList.add("keyboard-key");
  if (incorrect) {
    key.classList.add("incorrect");
  }
  key.addEventListener("click", () => {
    if (shouldBlockKeyEvents()) return;

    if (letter === "delete") {
      removeLastSquareValue();
      return;
    }

    if (letter === "enter") {
      const game = retrieve("game").data;
      if (game) {
        var lengthMatches = getAttemptLetters().length === game.word.length;
        console.log(getAttemptLetters().length, game.word.length);
        if (lengthMatches) attempt(game);
      } else {
        console.error("No game found");
      }
      return;
    }

    fillNextSquare(letter);
  });
  return key;
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

export {
  getKeyboardKey,
  updateKeyboardKeys,
  getIncorrectLetters,
  initializeKeyboardKeys,
};
