import { getGameBoard } from "../components/board/gameboard.js";
import { buildOnScreenKeyboard } from "../components/keyboard/on-screen-keyboard.js";
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

  const keyboard = buildOnScreenKeyboard(options.game);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "start";

  var forfeitButton = document.createElement("button");
  forfeitButton.classList.add("button", "forfeit");
  forfeitButton.id = "forfeit-game";
  forfeitButton.style.justifySelf = "start";
  forfeitButton.style.justifyContent = "start";
  forfeitButton.style.textAlign = "start";
  forfeitButton.style.width = "auto";
  forfeitButton.type = "button";
  forfeitButton.innerHTML = "<span class='material-symbols-outlined'>flag</span>";
  forfeitButton.addEventListener("click", () => {
    if (window.confirm("Are you sure you want to forfeit the game?"))
      forfeitGame();
  });
  buttonContainer.appendChild(forfeitButton);

  contentContainer.innerHTML = '';
  // Add the components to the game container
  contentContainer.appendChild(buttonContainer);
  contentContainer.appendChild(message);
  contentContainer.appendChild(board);
  contentContainer.appendChild(keyboard);
}

export { buildGameContainer as buildGameView };
