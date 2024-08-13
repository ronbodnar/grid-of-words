import { buildWordRowElement } from "./row.js";

/**
 * Generates the grid board to house the letter squares.
 * @param {Game} game - The game for building the grid board.
 * @returns {HTMLDivElement} - The board div element with all children.
 */
export const buildGameBoardElement = (rows, cols, game) => {
  const board = document.createElement("div");
  board.classList.add("board");

  const message = document.createElement("div");
  message.classList.add("message");

  board.appendChild(message);

  // Iteratively add rows equal to the number of max attempts
  for (var i = 0; i < rows; i++) {
    const row = buildWordRowElement(i, cols, game);
    board.appendChild(row);
  }

  return board;
};
