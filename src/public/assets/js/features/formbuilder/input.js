import { convertToCamelCase } from '../../shared/utils/helpers.js'

/**
 * Creates an input element with the specified options.
 * 
 * @param {string} fieldName - The name of the field, used as the placeholder text and to generate the id.
 * @param {Object} [options] - Optional settings for the input element.
 * @param {string} [options.type='text'] - The type of the input element (e.g., 'text', 'password').
 * @param {boolean} [options.required=true] - Whether the input is required.
 * @param {string} [options.id] - The id of the input element. If not provided, it will be generated from the fieldName.
 * @returns {HTMLInputElement} The created input element.
 */
export const createInput = (fieldName, options) => {
  options = options || {}

  const input = document.createElement('input')
  input.type = options.type || 'text'
  input.placeholder = fieldName || ''
  input.required = options.required || true
  input.id = options.id || convertToCamelCase(fieldName)

  return input
}
