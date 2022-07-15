import { getValidatedCharacters } from "../../utils/helpers.js";
import { getAttemptLetters } from "../../services/attempt.service.js";

/*
 * The individual square that houses a single character in the word grid.
 * @param {boolean} active - Whether the character is "typeable" or part of the current attempt's row.
 */
function generatedSquare(active) {
  var square = document.createElement("div");
  square.classList.add("square");

  // Add the active class to first available row
  if (active) square.classList.add("active");

  // Add the value within the square
  var value = document.createElement("p");
  value.classList.add("square-value");

  square.appendChild(value);

  return square;
}

/*
 * Animates the current attempt's results and updates the squares state.
 * @param {string} word - The current word being guessed.
 */
function updateCurrentAttemptSquares(word) {
  const validatedPositions = getValidatedCharacters(
    getAttemptLetters().join(""),
    word
  );
  var fullSquares = document.querySelectorAll(".square:is(.active):is(.full)");

  if (validatedPositions.length !== fullSquares.length) {
    console.ereror(
      "Somehow the square elements found differs from the chars in the word"
    );
    return;
  }

  for (var i = 0; i < validatedPositions.length; i++) {
    updateSquareBackground(fullSquares[i], validatedPositions[i]);
  }
}

/*
 * Updates the background color of a square based on its validation status.
 * @param {HTMLElement} square - The square element to update.
 * @param {boolean} valid - Whether the character is in the correct position.
 */
function updateSquareBackground(square, valid) {
  if (valid === true) {
    // Character is in the correct position
    square.style.backgroundColor = 'rgba(0, 163, 108, 0.2)';
  } else if (valid === false) {
    // Character is not in the correct position
    square.style.backgroundColor = 'rgba(255, 165, 0, 0.4)';
  } else {
    // Character is not in the word
    square.style.opacity = 0.3;
  }
}

export { generatedSquare, updateSquareBackground, updateCurrentAttemptSquares };