import { EXACT_MATCH, PARTIAL_MATCH, NO_MATCH } from "../../shared/utils/constants.js";
import { clickKeyboardKey } from "../../shared/services/event.service.js";

/**
 * Builds a key element based on the letter and className (for styling) and processes events for that key.
 * @param {string} letter - The letter to be displayed on the key.
 * @param {string} className - The class to be applied to the key, "incorrect", "partial", or "exact".
 * @return {Element} The built key element.
 */
export const buildKeyElement = (letter, className) => {
  var key = document.createElement("div");

  // Delete has a background that is set in the stylesheet
  if (letter !== "delete")
    key.textContent = letter.at(0).toUpperCase() + letter.substring(1);

  key.classList.add("keyboard-key");

  // Add the background class depending on the key state in the game.
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

  // Add the click/touch listener to the key.
  key.addEventListener("click", () => {
    clickKeyboardKey(letter);
  });
  return key;
};
