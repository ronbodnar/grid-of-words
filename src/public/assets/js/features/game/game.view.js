import { buildGameBoardElement } from "../gameboard/gameboard.js";
import { buildOnScreenKeyboardElement } from "../on-screen-keyboard/on-screen-keyboard.js";
import { buildView } from "../view/view.js";

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

  // Generate the gameboard and keyboard
  const gameboard = buildGameBoardElement(options);
  const keyboard = buildOnScreenKeyboardElement(options.game);
  buildView("game", {
    hasNavigationButton: true,
    additionalElements: [gameboard, keyboard],
  });
};