import { retrieve } from "../../services/storage.service.js";
import { shouldBlockKeyEvents } from "../../event-listeners.js";
import { attempt, getAttemptLetters } from "../../services/attempt.service.js";
import { fillNextSquare, removeLastSquareValue } from "../board/square.js";

var keyboardKeys = {};

const initializeKeyboardKeys = (game) => {
  const incorrectLetters = getIncorrectLetters(game.word, game.attempts);

  // Add enter and delete keys
  var enterKey = buildKeyElement("enter", false);
  enterKey.classList.add("enter-key");
  keyboardKeys["enter"] = enterKey;

  var deleteKey = buildKeyElement("delete", false);
  deleteKey.classList.add("delete-key");
  deleteKey.style.paddingTop = '13px';
  // Bootstrap Icons SVG. I'm not using any other icons for now so no need to import them all.
  deleteKey.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-backspace" viewBox="0 0 16 16"><path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/><path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>';
  keyboardKeys["delete"] = deleteKey;

  // Add a-z keys
  for (var i = 97; i <= 122; i++) {
    const letter = String.fromCharCode(i);
    var key = buildKeyElement(letter, incorrectLetters.includes(letter));
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

/*
 * Finds a list of letters that are not included in the correct word of the game.
 * Is this the best you can do?
 * @param {Game} game - The game to search attempts for.
 */
const getIncorrectLetters = (word, attemptedWords) => {
  var incorrectLetters = [];
  console.log(attemptedWords);
  for (var i = 0; i < attemptedWords.length; i++) {
    var attempt = attemptedWords[i];
    for (var j = 0; j < attempt.length; j++) {
      if (!word.includes(attempt.at(j))) {
        if (!incorrectLetters.includes(attempt.at(j))) {
          incorrectLetters.push(attempt.at(j));
        }
      }
    }
  }
  return incorrectLetters;
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
