import { generatedRow } from "./row.js";

/*
 * Generates the grid board to house the letter squares.
 * @param {Game} game - The game for building the grid board.
 * @returns {HTMLDivElement} - The board div element with all children.
 */
function getGameBoard(game) {
  if (!game) return null;

  // Create the board element
  const board = document.createElement("div");
  board.classList.add("board");

  // Iteratively add rows equal to the number of max attempts
  for (var i = 0; i < game.maxAttempts; i++) {
    const row = generatedRow(game, i);

    board.appendChild(row);
  }

  return board;
}

/*
 * Moves the active class from the current row to the previous row for new word attempts.
 */
function shiftActiveRow() {
  const square = document.querySelector(".square.active:first-child");
  const row = square.parentElement;
  const board = row.parentElement;
  const allRows = Array.from(board.children);

  // Remove the active class from the current row
  if (row) {
    var squares = Array.from(row.children);
    squares.forEach((square) => {
      square.classList.remove("active");
    });
  }

  // Find the next row
  for (var i = 0; i < allRows.length; i++) {
    if (allRows[i] === row) {
      var nextRow = allRows[i + 1];
      break;
    }
  }

  // Apply the active class to the next row
  if (nextRow) {
    var squares = Array.from(nextRow.children);
    squares.forEach((square) => {
      square.classList.add("active");
    });
  }

  console.log(nextRow);
}

export { getGameBoard, shiftActiveRow };
