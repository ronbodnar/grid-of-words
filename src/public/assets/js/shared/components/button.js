import { handleClickEvent } from "../services/event.service.js";
import { convertToCamelCase } from "../utils/helpers.js";

/**
 * Creates a button element with the specified text and options.
 * @param {*} text The text to be displayed on the button.
 * @param {*} options An object with the following properties:
 * - id: The id to assign the button element. (default: camelCase version of text).
 * - type: Type type to use for the button (eg: submit, button) (default: "button").
 * - classes: An array of class names to add to the button. (default: ["button", "fixed"]).
 * - icon: The name of the icon to add to the button. (File must be in /assets/material-icons as an SVG). (optional)
 * - loader: Whether or not to the add a (hidden) loading spinner to the button. (optional)
 * @returns {HTMLButtonElement} The created HTML button element.
 */
export const createButton = (text, options) => {
  if (!text) {
    console.error("Missing button text");
    return;
  }

  // Set up options and button attributes.
  options = options || {};
  const id = options.id || convertToCamelCase(text);
  const type = options.type || "button";
  const classes = options.classes || ["button", "fixed"];

  // Build the button element with the specified attributes.
  const button = document.createElement("button");
  button.id = id + "Button";
  button.type = type;

  // Add all of the classes to the button element.
  for (const c in classes) {
    button.classList.add(classes[c]);
  }
  
  // If imagePath is present, show the image before the text on the button.
  // Otherwise, just set the text content.
  if (options.icon) {
    button.innerHTML = `<img src='/assets/material-icons/${options.icon}.svg' style='vertical-align: -6px'> ${text}`;
  } else {
    button.textContent = text;
  }

  if (options.loader) {
    button.innerHTML += "<span class='button-loader hidden' id='submitButtonLoader'</span>";
  }

  button.addEventListener("click", (event) => handleClickEvent(event, options.eventArgs));

  return button;
};