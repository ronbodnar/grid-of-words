// TODO: Eventually do a queue system here to stack up the messages?

import { logger } from "../../main.js"
import { HIDE_MESSAGE_DELAY } from "../utils/constants.js"

let messageTimeout = undefined

/**
 * Update the message container in the current view (home or game) and sets a timeout to hide after a delay.
 *
 * @param {String} message - The message to show.
 * @param {object} options - Key/value pairs for optional parameters.
 */
export const showMessage = (message, options = {}) => {
  if (message == null) {
    throw new Error("No message provided to showMessage")
  }

  const {
    hide = false,
    hideDelay = HIDE_MESSAGE_DELAY,
    messageSelector = ".message",
    className,
  } = options

  logger.debug(
    `Showing message "${message}" with ${
      options.hideDelay ? options.hideDelay + "ms" : "no"
    } hide delay`
  )

  var messageDiv = document.querySelector(messageSelector)
  if (messageDiv) {
    messageDiv.innerHTML = message
    messageDiv.classList.remove("hidden", "success", "error")
    if (className) {
      messageDiv.classList.add(className)
    }
  } else {
    throw new Error(`Message div not found for message "${message}"`)
  }

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout)

  if (hide) {
    messageTimeout = setTimeout(() => {
      setTimeout(() => {
        messageDiv.innerHTML = ""
        messageDiv.classList.remove(className)
      }, 1000)
    }, hideDelay)
  }
}
