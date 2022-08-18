import { handleClickEvent } from "../services/event.service.js";

/**
 * Creates a paragraph text element with the given text and options.
 * @param {*} text The text content for the element.
 * @param {*} options An object with the following properties:
 * - type: The type of text element (required).
 * - text: The text content for the element (default value: "").
 * - hidden: Whether the element is hidden by default (default: false).
 * - emitClickEvents: Whether to add the button to the global click event handler (default: true).
 * - classList: An array of additional class names to be added to the element. (default: [])
 * @returns {HTMLParagraphElement | null} The generated paragraph element or null if options.type is not provided.
 */
export const createText = (options) => {
    options = options || {};

    // Extract the type from the options and verify it was passed in.
    // Throw an error if the type is not found.
    const type = options.type;
    if (!type) {
        console.error("Missing required option: type");
        return null;
    }

    // Set up default values for options.
    const text = options.text || "";
    const hidden = options.hidden || false;
    const emitClickEvents = options.emitClickEvents || true;

    // Create the paragraph element and set its inner HTML to the provided text.
    const textElement = document.createElement('p');
    textElement.innerHTML = text;

    // Set up the class list by adding the type from options.
    // Add the hidden class if specified in the options.
    // If necessary add any other classes provided in the options.
    textElement.classList.add(type);
    if (hidden) {
        textElement.classList.add("hidden");
    }
    for (const class_ in options.classList) {
        textElement.classList.add(options.classList[class_]);
    }

    // Add the global click event handler
    if (emitClickEvents) {
        textElement.addEventListener("click", (event) => handleClickEvent(event));
    }

    return textElement;
}