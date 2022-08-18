import { createButton } from "../../shared/components/button.js";

export const createNavigationButton = (viewName) => {
    if (!viewName) {
        console.error("View name is missing.");
        return;
    }
    // Set up the forfeit button attributes when building the home view.
    const buttonId = viewName === "game" ? "forfeitGame" : "back";
    const buttonIcon = viewName === "game" ? "block" : "keyboard-backspace";
    const buttonLabel = viewName === "game" ? "Forfeit" : "Back";
    const buttonClasses =
      viewName === "game" ? ["back-button", "forfeit"] : ["back-button"];
  
    const navigationButton = createButton(buttonLabel, {
      id: buttonId,
      icon: buttonIcon,
      classes: buttonClasses,
    });
  
    return navigationButton;
  };