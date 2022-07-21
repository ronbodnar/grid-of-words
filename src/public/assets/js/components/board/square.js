import { getValidatedLetters } from "../../utils/helpers.js";
import { getAttemptLetters } from "../../services/attempt.service.js";

/*
 * The individual square that houses a single letter in the word grid.
 * @param {boolean} active - Whether the letter is "typeable" or part of the current attempt's row.
 */
function generatedSquare() {
  var square = document.createElement("div");
  square.classList.add("square");

  // Add the value within the square
  var value = document.createElement("span");
  value.classList.add("square-value");

  square.appendChild(value);

  return square;
}

/*
 * Animates the current attempt's results and updates the squares state.
 * @param {string} word - The current word being guessed.
 */
function updateCurrentAttemptSquares(word) {
  const validatedPositions = getValidatedLetters(
    getAttemptLetters().join(""),
    word
  );
  console.log("Validated Positions: ", validatedPositions);
  var fullSquares = document.querySelectorAll(".word-row.active > .square:is(.full)");

  if (validatedPositions.length !== fullSquares.length) {
    console.error(
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
 * @param {boolean} valid - Whether the letter is in the correct position.
 */
function updateSquareBackground(square, valid) {
  if (valid === 1) {
    // Letter is in the correct position
    square.style.backgroundColor = "rgba(0, 163, 108, 0.9)";
    //square.children[0].style.color = "#0d1117";
  } else if (valid === 2) {
    // Letter is not in the correct position
    square.style.backgroundColor = "rgba(255, 165, 0, 0.9)";
    //square.children[0].style.color = "#0d1117";
  } else if (valid === 3) {
    // Letter is not in the word
    square.style.opacity = 0.5;
  }
}

function fillNextSquare(key) {
  // Block any key that isnt an alpha character
  if (/[^a-zA-Z]/.test(key)) {
    console.log("Invalid key:", key);
    return;
  }

  // Find all available squares
  var squares = document.querySelectorAll(".word-row.active > .square:not(.full)");

  // Ensure there's a square available, update the square properties, and add it to our stack of letters.
  if (squares[0]) {
    squares[0].classList.add("full");
    squares[0].children[0].textContent = key.toUpperCase();
    getAttemptLetters().push(key);
  }
}

function removeLastSquareValue() {
  // Find all full squares (active is set by the server)
  var squares = document.querySelectorAll(".word-row.active > .square:is(.full)");

  // If there are letters, adjust the square properties and pop the letter off the stack of letters.
  if (getAttemptLetters().length > 0) {
    squares[getAttemptLetters().length - 1].classList.remove("full");
    squares[getAttemptLetters().length - 1].children[0].textContent = "";
    getAttemptLetters().pop();
  }
}

export {
  fillNextSquare,
  generatedSquare,
  removeLastSquareValue,
  updateSquareBackground,
  updateCurrentAttemptSquares,
};
