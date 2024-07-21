import { getValidatedLetters } from "../../utils/helpers.js";
import { getAttemptLetters } from "../../services/attempt.service.js";
import { EXACT_MATCH, PARTIAL_MATCH } from "../../constants.js";

/*
 * The individual square that houses a single letter in the word grid.
 * @param {boolean} active - Whether the letter is "typeable" or part of the current attempt's row.
 */
export const generatedSquare = () => {
  // Create the fixed main square element with the border (this is not changed during attempts)
  const square = document.createElement("div");
  square.classList.add("square");

  // Add the value container to house the letter element (this is what's animated during attempts)
  const valueContainer = document.createElement("div");
  valueContainer.classList.add("square-value-container");

  // Create the square value element
  const value = document.createElement("span");
  value.classList.add("square-value");

  valueContainer.appendChild(value);
  square.appendChild(valueContainer);

  return square;
};

/*
 * Animates the current attempt's results and updates the squares state.
 * @param {string} word - The current word being guessed.
 */
export const updateCurrentAttemptSquares = (word) => {
  const validatedPositions = getValidatedLetters(
    getAttemptLetters().join(""),
    word
  );
  const fullSquares = document.querySelectorAll(
    ".word-row.active > .square:is(.full) > .square-value-container"
  );

  if (validatedPositions.length !== fullSquares.length) {
    console.error(
      "Somehow the square elements found differs from the chars in the word"
    );
    return;
  }

  for (let i = 0; i < validatedPositions.length; i++) {
    updateSquareBackground(fullSquares[i], validatedPositions[i]);
  }
};

/*
 * Updates the background color of a square based on its validation status.
 * @param {HTMLElement} square - The square element to update.
 * @param {boolean} valid - Whether the letter is in the correct position.
 */
export const updateSquareBackground = (square, match) => {
  switch (match) {
    case EXACT_MATCH:
      square.style.backgroundColor = "rgba(0, 163, 108, 0.9)";
      break;

    case PARTIAL_MATCH:
      square.style.backgroundColor = "rgba(255, 165, 0, 0.9)";
      break;
  }
};
