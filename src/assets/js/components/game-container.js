import { generatedBoard } from "./board/board.js";

/*
 * Renders the game container based on the provided game.
 * @param {Game} game - The game to render.
 */
function renderGameContainer(game) {
  console.log('Rendering Game Container for game: ', game);
  if (game == null) return;

  const container = document.querySelector("#game-container");
  if (!container) return;

  // Clear the game container's content
  container.innerHTML = "";

  const message = document.createElement("div");
  message.classList.add("message");

  const board = generatedBoard(game);

  // Add the components to the game container
  container.appendChild(message);
  container.appendChild(board);
}

export { renderGameContainer };
