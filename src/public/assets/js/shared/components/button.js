import { handleClickEvent } from '../services/event.service.js'
import { convertToCamelCase } from '../utils/helpers.js'

/**
 * Creates a button element with the specified text and options.
 * @param {string} text The text content of the button.
 * @param {Object} [options={}] - Additional options to be passed.
 * @param {string} [options.id] - The id to assign to the button element (default: text in camelCase).
 * @param {string} [options.type="button"] - The type to assign to the button element.
 * @param {Array} [options.classes=["button", "fixed"]] - An Array of classes to be added to the button element.
 * @param {string} [options.icon] - (optional) - The icon to be added to the button element.
 * @param {boolean} [options.loader=false] - (optional) - Whether to add a loader to the button element.
 * @param {Object} [options.eventArgs={}] - (optional) - The event arguments to be passed when handling the click event.
 * @returns {HTMLButtonElement} The created HTML button element.
 */
export const createButton = (text, options = {}) => {
  if (!text) {
    throw new Error('Missing button text')
  }

  const {
    id = convertToCamelCase(text),
    type = 'button',
    classes = ['button', 'fixed'],
    icon,
    loader,
    eventArgs = {}
  } = options

  const button = document.createElement('button')
  button.id = id + 'Button'
  button.type = type

  // Add all of the classes to the button element.
  classes.forEach((class_) => button.classList.add(class_))

  // If icon is present, add the icon before the text on the button, otherwise set the text only.
  button.innerHTML = icon
    ? `<img src='/assets/material-icons/${options.icon}.svg' style='vertical-align: -6px'> ${text}`
    : text

  if (loader) {
    button.innerHTML += "<span class='button-loader hidden' id='submitButtonLoader'</span>"
  }

  button.addEventListener('click', (event) => handleClickEvent(event, eventArgs))

  return button
}
