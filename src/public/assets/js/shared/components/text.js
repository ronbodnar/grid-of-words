import { handleClickEvent } from "../services/event.service.js";

/**
 * Creates a paragraph text element with the given text and options.
 * @param {Object} [options={}] - Additional options to be passed.
 * @param {string} [options.type] The type of text element to create ("view-header", "subheader", "message", "submessage").
 * @param {string} [options.text=""] The text content to set for the element.
 * @param {boolean} [options.hidden=false] Whether the element should be hidden by default.
 * @param {boolean} [options.emitClickEvent=false] Whether the element should add an event listener for click events.
 * @param {Array} [options.classes=[]] An array of class names to be applied to the element.
 * @returns {HTMLParagraphElement | null} The generated paragraph element or null if a type is not provided.
 */
export const createText = (options = {}) => {
  const {
    type,
    text = "",
    hidden = false,
    emitClickEvent = false,
    classes = [],
  } = options;

  if (!type) {
    throw new Error("Missing required option: type");
  }

  const textElement = document.createElement("p");
  textElement.innerHTML = text;

  textElement.classList.add(type);
  if (hidden) {
    textElement.classList.add("hidden");
  }
  // Add additional class names to the element.
  classes.forEach((class_) => textElement.classList.add(class_));

  // Add the global click event handler
  if (emitClickEvent) {
    textElement.addEventListener("click", (event) => handleClickEvent(event));
  }

  return textElement;
};
