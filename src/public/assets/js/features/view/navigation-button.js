import { logger } from "../../main.js";
import { createButton } from "../../shared/components/button.js";

/**
 * Creates a new navigation button (either back or forfeitGame, based on the viewName) using createButton().
 * 
 * @param {string} viewName The name of the view where the navigation button will be created.
 * @returns {HTMLButtonElement} The new navigation button.
 */
export const createNavigationButton = (viewName) => {
  if (!viewName) {
    logger.error("View name is missing.");
    return;
  }

  const isGameView = viewName === "game";
  const buttonId = isGameView ? "forfeitGame" : "back";
  const buttonIcon = isGameView ? "block" : "keyboard-backspace";
  const buttonLabel = isGameView ? "Forfeit" : "Back";
  const buttonClasses = ["back-button"].concat(isGameView ? "forfeit" : []);

  const navigationButton = createButton(buttonLabel, {
    id: buttonId,
    icon: buttonIcon,
    classes: buttonClasses,
  });

  return navigationButton;
};
