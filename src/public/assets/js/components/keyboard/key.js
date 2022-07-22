import { retrieve } from "../../services/storage.service.js";
import { shouldBlockKeyEvents } from "../../event-listeners.js";
import { attempt } from "../../services/attempt.service.js";
import { fillNextSquare, removeLastSquareValue } from "../board/gameboard.js";
import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "../../constants.js";

/*
 * Dynamically builds a key element based on the letter and className (for styling) and processes events for that key.
 * @param {string} letter - The letter to be displayed on the key.
 * @param {string} className - The class to be applied to the key, "incorrect", "partial", or "exact".
 * @return {Element} The built key element.
 */
export const buildKeyElement = (letter, className) => {
  var key = document.createElement("div");
  if (letter !== "delete") // Delete has a background that is set in the stylesheet
    key.textContent = letter.at(0).toUpperCase() + letter.substring(1);
  key.classList.add("keyboard-key");
  switch (className) {
    case EXACT_MATCH:
      key.classList.add("exact");
      break;

    case PARTIAL_MATCH:
      key.classList.add("partial");
      break;

    case NO_MATCH:
      key.classList.add("incorrect");
      break;
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
        attempt(game);
      } else {
        console.error("No game found");
      }
      return;
    }

    fillNextSquare(letter);
  });
  return key;
};
