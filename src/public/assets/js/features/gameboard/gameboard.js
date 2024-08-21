import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "../../shared/utils/constants.js";
import { Game } from "../game/Game.js";
import { buildWordRowElement } from "./row.js";

/**
 * Generates the grid board to house the letter squares.
 * @param {Game} game - The game for building the grid board.
 * @returns {HTMLDivElement} - The board div element with all children.
 */
export const buildGameBoardElement = (options) => {
  if (!options) {
    throw new Error("No options passed to buildGameBoardElement")
  }
  const rows = options.game?.maxAttempts || options.maxAttempts || DEFAULT_MAX_ATTEMPTS;
  const cols = options.game?.word?.length || options.wordLength || DEFAULT_WORD_LENGTH;
  const game = options.game;

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