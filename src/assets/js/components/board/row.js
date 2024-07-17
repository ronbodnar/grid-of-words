import { generatedSquare, updateSquareBackground } from "./square.js";
import { getValidatedLetters } from "../../utils/helpers.js";

/*
 * Generates a row of squares of the word length for the game.
 * @param {Game} game - The game to generate the row for.
 * @param {index} index - The row's index on the board.
 * @returns {HTMLDivElement} - The generated row with all squares.
 */
function generatedRow(index, cols, game) {
  const row = document.createElement("div");
  row.classList.add("word-row");

  // Add squares equal to the length of the word in the row
  for (var j = 0; j < cols; j++) {
    const active = index === (game?.attempts?.length || 0);
    const square = generatedSquare(active);

    // Update the square background if the letter is not in the word
    if (game && index < game.attempts.length) {
      square.children[0].textContent = game.attempts[index].at(j).toUpperCase();

      const validatedPositions = getValidatedLetters(
        game.attempts[index],
        game.word
      );
      updateSquareBackground(square, validatedPositions[j]);
    }

    row.appendChild(square);
  }

  return row;
}

export { generatedRow };
