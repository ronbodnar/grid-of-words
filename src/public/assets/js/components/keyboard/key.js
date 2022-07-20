import { retrieve } from "../../services/storage.service.js";
import { shouldBlockKeyEvents } from "../../event-listeners.js";
import { attempt, getAttemptLetters } from "../../services/attempt.service.js";
import { fillNextSquare, removeLastSquareValue } from "../board/square.js";

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

export { buildKeyElement};
