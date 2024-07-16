import { getGameBoard } from "./board/gameboard.js";
import { getOnScreenKeyboard } from "./keyboard/on-screen-keyboard.js";

/*
 * Renders the game container based on the provided game.
 * @param {Game} game - The game to render.
 */
function buildGameContainer(game) {
  console.log('Rendering Game Container for game: ', game);
  if (game == null) return;

  const container = document.querySelector("#game-container");
  if (!container) return;

  // Clear the game container's content
  container.innerHTML = "";

  const message = document.createElement("div");
  message.classList.add("message");

  const board = getGameBoard(game);
  const keyboard = getOnScreenKeyboard(game);

  // Add the components to the game container
  container.appendChild(message);
  container.appendChild(board);
  container.appendChild(keyboard);
}

export { buildGameContainer };
