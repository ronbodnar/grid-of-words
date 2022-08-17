import { getValidatedLetters } from "../../shared/utils/helpers.js";
import { getAttemptLetters } from "../attempts/attempt.service.js";
import { NO_MATCH, EXACT_MATCH, PARTIAL_MATCH } from "../../shared/utils/constants.js";

/**
 * Moves the active class from the current row to the next row for new word attempts.
 */
export const shiftActiveRow = () => {
  const currentRow = document.querySelector(".word-row.active");
  const nextRow = currentRow?.nextElementSibling;

  // Swap the active class from the current to the next row.
  currentRow?.classList?.remove("active");
  nextRow?.classList?.add("active");
};

/**
 * Animates the showing and hiding of the letters in the row by changing the opacity on an increasing timeout interval.
 *
 * @param {boolean} hide - Whether to hide the squares or not.
 * @param {boolean} instant - Whether the hiding/showing of squares should be instant.
 * @return {Promise} The promise resolves when all squares are hidden/shown, plus an additional delay of 300 milliseconds.
 */
export const transformSquares = (hide, instant) => {
  const activeRow = document.querySelector(".word-row.active");
  if (!activeRow) return Promise.reject(new Error("No active row found"));

  const squares = Array.from(activeRow.children);
  return new Promise((resolve) => {
    let delay = 0;
    squares.forEach((square, i) => {
      setTimeout(
        () => {
          const squareValue = square.children[0];
          if (squareValue) {
            squareValue.style.opacity = hide ? "0" : "1";
          }
          if (i === squares.length - 1) {
            // Resolve the Promise 300ms after the last square has processed.
            setTimeout(() => resolve(true), instant ? 0 : 300);
          }
        },
        hide ? 0 : (delay += instant ? 0 : 300)
      );
    });
  });
};

/**
 * Validates and fills the letter into the next available square in the row and pushes to the stack of attempt letters.
 *
 * @param {string} letter - The letter to be filled into the next available square.
 */
export const fillNextSquare = (letter) => {
  // Block any key that isnt an alpha character.
  if (/[^a-zA-Z]/.test(letter)) {
    return;
  }

  // Find all available squares in the active word row.
  const nextAvailableSquare = document.querySelector(
    ".word-row.active > .square:not(.full)"
  );

  // Ensure there's a square available, update the square properties, and add it to our stack of letters.
  if (nextAvailableSquare) {
    nextAvailableSquare.classList.add("full");
    nextAvailableSquare.children[0].textContent = letter.toUpperCase();
    nextAvailableSquare.children[0].style.transition = "0.3s";
    nextAvailableSquare.children[0].style.transform = "scale(1.2)";
    setTimeout(() => {
      nextAvailableSquare.children[0].style.transform = "scale(1)";
    }, 200);
    getAttemptLetters().push(letter.toLowerCase());
  }
};

/**
 * Pops the stack of letters in the attempt word and updates the square text content.
 */
export const removeLastSquareValue = () => {
  // Find all full squares in the active word row.
  const squares = document.querySelectorAll(
    ".word-row.active > .square:is(.full)"
  );

  // If there are letters, adjust the square properties and pop the attemptLetter stack.
  if (getAttemptLetters().length > 0) {
    const lastSquare = squares[getAttemptLetters().length  - 1];
    lastSquare.classList.remove("full");
    lastSquare.children[0].textContent = "";
    getAttemptLetters().pop();
  }
};

/**
 * Animates the current attempt's results and updates the squares state.
 *
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

/**
 * Updates the background color of a square based on its match state.
 *
 * @param {HTMLElement} square - The square element to update.
 * @param {number} match - The match state of the square.
 */
export const updateSquareBackground = (square, match) => {
  switch (match) {
    case EXACT_MATCH:
      square.style.backgroundColor = "rgba(0, 163, 108, 0.9)";
      break;

    case PARTIAL_MATCH:
      square.style.backgroundColor = "rgba(255, 165, 0, 0.9)";
      break;

    case NO_MATCH:
      square.style.color = "rgba(244, 243, 242, 0.6)";
      break;
  }
};
