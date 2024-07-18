import { getGameBoard } from "../components/board/gameboard.js";
import { getOnScreenKeyboard } from "../components/keyboard/on-screen-keyboard.js";
import { forfeitGame } from "../services/game.service.js";

/*
 * Renders the game container based on the provided game.
 * @param {Game} game - The game to render.
 */
function buildGameContainer(options) {
  if (!options) {
    console.error("No options present");
    return;
  }

  console.log("options", options.game);

  const contentContainer = document.querySelector(".content");
  contentContainer.id = "game";

  const message = document.createElement("div");
  message.classList.add("message");

  var board = undefined;
  if (options.game) {
     console.log('Rendering Game Container for game: ', options.game);
     board = getGameBoard(options.game.maxAttempts, options.game.word.length, options.game);
  } else if (options.wordLength && options.maxAttempts) {
    console.log(`Rendering Game Container with grid ${options.maxAttempts} x ${options.wordLength}`);
    board = getGameBoard(options.maxAttempts, options.wordLength);
  }

  const keyboard = getOnScreenKeyboard(options.game);

  var forfeitButton = document.createElement("button");
  forfeitButton.classList.add("button", "fixed", "forfeit");
  forfeitButton.id = "forfeit-game";
  forfeitButton.type = "button";
  forfeitButton.textContent = "Forfeit";
  forfeitButton.addEventListener("click", () => {
    forfeitGame();
  });

  contentContainer.innerHTML = '';
  // Add the components to the game container
  contentContainer.appendChild(forfeitButton);
  contentContainer.appendChild(message);
  contentContainer.appendChild(board);
  contentContainer.appendChild(keyboard);
}

export { buildGameContainer as buildGameView };
