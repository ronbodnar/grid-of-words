import { generatedRow } from "./row.js";

/*
 * Generates the grid board to house the letter squares.
 * @param {Game} game - The game for building the grid board.
 * @returns {HTMLDivElement} - The board div element with all children.
 */
function getGameBoard(rows, cols, game) {
  // Create the board element
  const board = document.createElement("div");
  board.classList.add("board");

  // Iteratively add rows equal to the number of max attempts
  for (var i = 0; i < rows; i++) {
    const row = generatedRow(i, cols, game);

    board.appendChild(row);
  }

  return board;
}

/*
 * Moves the active class from the current row to the previous row for new word attempts.
 */
function shiftActiveRow() {
  const currentRow = document.querySelector(".word-row.active");
  const nextRow = currentRow?.nextElementSibling;

  // Swap the active class from the current to the next row.
  currentRow?.classList?.remove("active");
  nextRow?.classList?.add("active");
}

export { getGameBoard, shiftActiveRow };
