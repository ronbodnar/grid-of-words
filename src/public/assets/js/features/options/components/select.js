import { convertToCamelCase } from "../../../shared/utils/helpers.js"

/**
 * Builds a select/dropdown section with a title and a select input element.
 *
 * @param {string} id - The unique identifier for the select elements.
 * @param {Object} options - An object of options where key is the id and the value is the displayed text.
 * @returns {HTMLDivElement} The container element containing the select section.
 */
export const buildSelect = (id, { defaultValue = "", optionList = []}) => {
  const selectInput = document.createElement('select')
  selectInput.style.width = "100%";
  selectInput.value = defaultValue
  selectInput.id = `${id}Select`

  optionList.forEach((option) => {
    const optionElement = document.createElement('option')
    optionElement.value = convertToCamelCase(option)
    optionElement.textContent = option
    selectInput.appendChild(optionElement)
  });
  return selectInput;
}