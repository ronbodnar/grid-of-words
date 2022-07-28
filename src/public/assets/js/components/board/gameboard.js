import { generatedRow } from "./row.js";
import { getAttemptLetters } from "../../services/attempt.service.js";

/*
 * Generates the grid board to house the letter squares.
 * @param {Game} game - The game for building the grid board.
 * @returns {HTMLDivElement} - The board div element with all children.
 */
export const getGameBoard = (rows, cols, game) => {
  // Create the board element
  const board = document.createElement("div");
  board.classList.add("board");

  const message = document.createElement("div");
  message.classList.add("message");

  // Display a message after a word attempt or upon error.
  board.appendChild(message);

  // Iteratively add rows equal to the number of max attempts
  for (var i = 0; i < rows; i++) {
    const row = generatedRow(i, cols, game);

    board.appendChild(row);
  }

  return board;
};

/*
 * Moves the active class from the current row to the next row for new word attempts.
 */
export const shiftActiveRow = () => {
  const currentRow = document.querySelector(".word-row.active");
  const nextRow = currentRow?.nextElementSibling;

  // Swap the active class from the current to the next row.
  currentRow?.classList?.remove("active");
  nextRow?.classList?.add("active");
};

/*
 * Animates the showing and hiding of the letters in the row by changing the opacity on an increasing timeout interval.
 * @param {boolean} hide - Whether to hide the squares or not.
 * @return {Promise} The promise resolves when all squares are hidden/shown, plus an additional delay of 300 milliseconds.
 */
export const transformSquares = (hide) => {
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
            // Resolve the Promise 500ms after the last square has processed.
            setTimeout(() => resolve(true), 500);
          }
        },
        hide ? 0 : (delay += 500)
      );
    });
  });
};

/*
 * Validates and fills the key into the next available square in the row and pushes to the stack of attempt letters.
 * @param {string} key - The key character to be filled into the next available square.
 */
export const fillNextSquare = (key) => {
  // Block any key that isnt an alpha character
  if (/[^a-zA-Z]/.test(key)) {
    return;
  }

  // Find all available squares
  const squares = document.querySelectorAll(
    ".word-row.active > .square:not(.full)"
  );

  // Ensure there's a square available, update the square properties, and add it to our stack of letters.
  if (squares[0]) {
    squares[0].classList.add("full");
    squares[0].children[0].textContent = key.toUpperCase();
    squares[0].children[0].style.transition = "0.3s";
    squares[0].children[0].style.transform = "scale(1.2)";
    setTimeout(() => {
      squares[0].children[0].style.transform = "scale(1)";
    }, 200);
    getAttemptLetters().push(key.toLowerCase());
  }
};

/*
 * Pops the stack of letters in the attempt word and updates the square text content.
 */
export const removeLastSquareValue = () => {
  // Find all full squares (active is set by the server)
  const squares = document.querySelectorAll(
    ".word-row.active > .square:is(.full)"
  );

  // If there are letters, adjust the square properties and pop the letter off the stack of letters.
  if (getAttemptLetters().length > 0) {
    squares[getAttemptLetters().length - 1].classList.remove("full");
    squares[getAttemptLetters().length - 1].children[0].textContent = "";
    getAttemptLetters().pop();
  }
};
