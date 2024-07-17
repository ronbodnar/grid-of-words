import { getGameBoard } from "./board/gameboard.js";
import { getOnScreenKeyboard } from "./keyboard/on-screen-keyboard.js";

/*
 * Renders the game container based on the provided game.
 * @param {Game} game - The game to render.
 */
function buildGameContainer(options) {
  if (!options) {
    console.error("No options present");
    return;
  }
  
  //if (game == null) return;

  const container = document.querySelector("#game-container");
  if (!container) return;

  // Clear the game container's content
  container.innerHTML = "";

  const message = document.createElement("div");
  message.classList.add("message");


  console.log("options", options.game);

  var board = undefined;
  if (options.game) {
     console.log('Rendering Game Container for game: ', options.game);
     board = getGameBoard(options.game.maxAttempts, options.game.word.length, options.game);
  } else if (options.wordLength && options.maxAttempts) {
    console.log(`Rendering Game Container with grid ${options.maxAttempts} x ${options.wordLength}`);
    board = getGameBoard(options.maxAttempts, options.wordLength);
  }

  const keyboard = getOnScreenKeyboard(options.game);

  // Add the components to the game container
  container.appendChild(message);
  container.appendChild(board);
  container.appendChild(keyboard);
}

export { buildGameContainer };
