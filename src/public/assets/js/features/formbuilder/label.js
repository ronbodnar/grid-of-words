import { convertToCamelCase } from "../../shared/utils/helpers.js"

/**
 * Creates a label element associated with a specific input field.
 *
 * @param {string} text - The text content of the label, also used to generate the `for` attribute.
 * @returns {HTMLLabelElement} The created label element.
 */
export const createLabel = (text) => {
  const label = document.createElement("label")
  label.htmlFor = convertToCamelCase(text)
  label.textContent = text

  return label
}
