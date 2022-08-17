import { showMessage } from "../../shared/services/message.service.js";
import { convertToCamelCase } from "../../shared/utils/helpers.js";
import { createButton } from "../../shared/components/button.js";

/**
 * Clears the content container and builds a standard view with specified additional elements and options.
 *
 * @param {*} name The name to be assigned to the view container.
 * @param {*} options Additional options to be passed to the view.
 */
export const buildView = (name, options) => {
  if (!name) {
    console.error("No name provided");
    return;
  }

  options = options || {};

  // Find the content container div, set the id and clear its contents.
  const contentContainer = document.querySelector(".content");
  contentContainer.id = convertToCamelCase(name);
  contentContainer.innerHTML = "";

  // Create the navigation button (top left) and add it to the content container.
  if (options.hasNavigationButton) {
    // Set up the forfeit button attributes when building the home view.
    const buttonId = name === "game" ? "forfeitGame" : "back";
    const buttonIcon = name === "game" ? "block" : "keyboard-backspace";
    const buttonLabel = name === "game" ? "Forfeit" : "Back";
    const buttonClasses =
      name === "game" ? ["back-button", "forfeit"] : ["back-button"];

    const navigationButton = createButton(buttonLabel, {
      id: buttonId,
      icon: buttonIcon,
      classes: buttonClasses,
    });
    contentContainer.appendChild(navigationButton);
  }

  if (options.header) {
    const header = document.createElement("h1");
    header.classList.add("view-header");
    header.textContent = options.header;
    contentContainer.appendChild(header);
  }

  if (options.subheader) {
    const subheader = document.createElement("div");
    subheader.classList.add("submessage");
    subheader.textContent = options.subheader;
    contentContainer.appendChild(subheader);
  }

  if (options.message) {
    const message = options.message;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "form-message");
    if (message.hidden) {
        messageElement.classList.add("hidden");
    }
    contentContainer.appendChild(messageElement);

    // Display the message with the specified options.
    if (message.text && message.text.length > 0) {
      const options = {
        hide: message.hide || true,
        hideDelay: message.hideDelay || 10000,
        className: message.className,
      };

      showMessage(message.text, options);
    }
  }

  // Each view has its specific elements / divisions and they're added here.
  if (options.additionalElements) {
    if (!Array.isArray(options.additionalElements)) {
      console.error("Additional elements must be an array");
      return;
    }
    options.additionalElements.forEach((element) => {
      contentContainer.appendChild(element);
    });
  }
};
