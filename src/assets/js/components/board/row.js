import { generatedSquare, updateSquareBackground } from "./square.js";
import { getValidatedCharacters } from "../../utils/helpers.js";

/*
 * Generates a row of squares of the word length for the game.
 * @param {Game} game - The game to generate the row for.
 * @param {index} index - The row's index on the board.
 * @returns {HTMLDivElement} - The generated row with all squares.
 */
function generatedRow(game, index) {
  const row = document.createElement("div");
  row.classList.add("word-row");

  // Add squares equal to the length of the word in the row
  for (var j = 0; j < game.word.length; j++) {
    const active = index === game.attempts.length;
    const square = generatedSquare(active);
    if (index < game.attempts.length) {
      square.children[0].innerHTML = game.attempts[index].at(j).toUpperCase();

      const validatedPositions = getValidatedCharacters(
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
