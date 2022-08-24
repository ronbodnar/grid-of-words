import { createButton } from "../../shared/components/button.js";

/**
 * Creates a new navigation button (either back or abandonGame, based on the viewName) using createButton().
 * 
 * @param {string} viewName The name of the view where the navigation button will be created.
 * @returns {HTMLButtonElement} The new navigation button.
 */
export const createNavigationButton = (viewName) => {
  if (!viewName) {
    throw new Error("Missing viewName");
  }

  const isGameView = viewName === "game";
  const buttonId = isGameView ? "abandonGame" : "back";
  const buttonIcon = isGameView ? "block" : "keyboard-backspace";
  const buttonLabel = isGameView ? "Abandon" : "Back";
  const buttonClasses = ["back-button"].concat(isGameView ? "abandon" : []);

  const navigationButton = createButton(buttonLabel, {
    id: buttonId,
    icon: buttonIcon,
    classes: buttonClasses,
  });

  return navigationButton;
};
