import { buildGameBoard } from "../components/board/gameboard.js";
import { buildOnScreenKeyboard } from "../components/keyboard/on-screen-keyboard.js";
import { clickForfeitGameButton } from "../services/event.service.js";

/**
 * Builds the game container based on the provided options (assumed to be a Game object or wordLength/maxAttempts)
 *
 * @param {object} options - The options to build the game container.
 */
export const buildGameView = (options) => {
  if (!options) {
    console.error("No options present");
    return;
  }

  const contentContainer = document.querySelector(".content");
  contentContainer.id = "game";

  let board;
  if (options.game) {
    console.info("Rendering Game Container for game: ", options.game);
    board = buildGameBoard(
      options.game.maxAttempts,
      options.game.word.length,
      options.game
    );
  } else if (options.wordLength && options.maxAttempts) {
    console.info(
      `Rendering Game Container with grid ${options.maxAttempts} x ${options.wordLength}`
    );
    board = buildGameBoard(options.maxAttempts, options.wordLength);
  }

  const keyboard = buildOnScreenKeyboard(options.game);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "start";

  const forfeitButton = document.createElement("button");
  forfeitButton.classList.add("button", "forfeit");
  forfeitButton.id = "forfeit-game";
  forfeitButton.style.justifySelf = "start";
  forfeitButton.style.justifyContent = "start";
  forfeitButton.style.textAlign = "start";
  forfeitButton.style.width = "auto";
  forfeitButton.type = "button";
  forfeitButton.innerHTML = "Forfeit";
  forfeitButton.addEventListener("click", clickForfeitGameButton);
  buttonContainer.appendChild(forfeitButton);

  // Clear the existing content from the content container
  contentContainer.innerHTML = "";

  // Add the components to the game container
  contentContainer.appendChild(buttonContainer);
  contentContainer.appendChild(board);
  contentContainer.appendChild(keyboard);
};
