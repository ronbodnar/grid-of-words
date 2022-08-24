import { buildGameBoardElement } from "../gameboard/gameboard.js";
import { buildOnScreenKeyboardElement } from "../keyboard/keyboard.js";
import { buildView } from "../view/view.js";

/**
 * Builds the game container based on the provided options (assumed to be a Game object or wordLength/maxAttempts)
 *
 * @param {object} options - The options to build the game container.
 */
export const buildGameView = (options) => {
  if (!options) {
    throw new Error("No options passed to buildGameView");
  }

  const gameboard = buildGameBoardElement(options);
  const keyboard = buildOnScreenKeyboardElement(options.game);
  buildView("game", {
    additionalElements: [gameboard, keyboard],
  });
};