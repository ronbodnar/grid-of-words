import { createButton } from "../../shared/components/button.js";
import { buildGameBoardElement } from "../gameboard/gameboard.js";
import { buildOnScreenKeyboardElement } from "../keyboard/on-screen-keyboard.js";

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

  const gameboard = getGameBoardElement(options);
  const keyboard = buildOnScreenKeyboardElement(options.game);

  const forfeitButton = createButton("Forfeit", "forfeitGame", {
    icon: "block",
    classes: ["back-button", "forfeit"],
  });

  // Clear the existing content from the content container
  contentContainer.innerHTML = "";

  // Add the components to the game container
  contentContainer.appendChild(forfeitButton);
  contentContainer.appendChild(gameboard);
  contentContainer.appendChild(keyboard);
};

/**
 * Builds the game board component based on the given options.
 *
 * @param {Array} options
 * @returns {Element} The built gameboard component.
 */
const getGameBoardElement = (options) => {
  if (options.game) {
    console.info("Rendering Game Container for game: ", options.game);
    return buildGameBoardElement(
      options.game.maxAttempts,
      options.game.word.length,
      options.game
    );
  } else if (options.wordLength && options.maxAttempts) {
    console.info(
      `Rendering Game Container with grid ${options.maxAttempts} x ${options.wordLength}`
    );
    return buildGameBoardElement(options.maxAttempts, options.wordLength);
  }
};