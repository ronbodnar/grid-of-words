import { showMessage } from "../../shared/services/message.service.js";
import { APP_NAME } from "../../shared/utils/constants.js";
import { createNavigationButton } from "./navigation-button.js";
import { createText } from "../../shared/components/text.js";

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

  // Update the title of the page to reflect the current view.
  window.document.title = options.title || APP_NAME;

  options = options || {};

  // Find the content container, set the id and clear the innerHTML.
  const contentContainer = document.querySelector(".content");
  contentContainer.id = name;
  contentContainer.innerHTML = "";

  // Create the navigation button and add it to the content container.
  if (options.hasNavigationButton) {
    const navigationButton = createNavigationButton(name);
    contentContainer.appendChild(navigationButton);
  }

  // Create the optional header element
  if (options.headerText) {
    const header = createText({
      text: options.headerText,
      type: "view-header",
    });
    contentContainer.appendChild(header);
  }

  // Create an optional subheader element
  if (options.subheaderText) {
    const subheader = createText({
      type: "subheader",
      text: options.subheaderText,
    });
    contentContainer.appendChild(subheader);
  }

  // Extract the message details from the options and add a default location if not present.
  const message = options.message;
  const messageLocation = message?.location || "top";
  let messageElement;
  if (message) {
    messageElement = createText({
      type: "message",
      hidden: message.hidden,
    });

    // Only add the message element here if the messageLocation is set to "top".
    if (messageLocation === "top") {
      contentContainer.appendChild(messageElement);
    }
  }

  // Each view has its specific elements and they're added here.
  if (options.additionalElements) {
    if (!Array.isArray(options.additionalElements)) {
      console.error("Additional elements must be an array");
      return;
    }
    options.additionalElements.forEach((element) => {
      contentContainer.appendChild(element);
    });
  }

  // Some views push the message to the bottom of the container
  // If the message element was created and the message.location is "bottom", add it here.
  if (messageElement && messageLocation === "bottom") {
    contentContainer.appendChild(messageElement);
  }

  // Some views may have an additional submessage below the additional elements
  // If passed a submessage, B=build the submessage element and append it to the content container.
  if (options.submessageText) {
    const submessage = createText({
      type: "submessage",
      text: options.submessageText,
      emitClickEvent: true,
    });
    contentContainer.appendChild(submessage);
  }

  // Display the message with the specified options.
  if (message && message.text?.length > 0 && messageElement) {
    const options = {
      hide: message.hide || true,
      hideDelay: message.hideDelay || 10000,
      className: message.className,
    };

    showMessage(message.text, options);
  }
};
