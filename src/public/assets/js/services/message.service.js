// TODO: Eventually do a queue system here to stack up the messages?

import { HIDE_MESSAGE_DELAY } from "../constants.js";

// Used to clear any existing message timeouts.
let messageTimeout = undefined;

/**
 * Update the message container in the current view (home or game) and sets a timeout to hide after a delay.
 *
 * @param {String} message - The message to show.
 * @param {object} options - Key/value pairs for optional parameters.
 */
export const showMessage = (message, options = {}) => {
  if (message.length < 1) return;

  //console.log(`Showing message "${message}" with ${(options.hideDelay ? options.hideDelay + 'ms' : 'no')} delay`);

  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) {
    messageDiv.classList.remove("hidden");
    messageDiv.classList.remove("success", "error")
    if (options.className) {
      messageDiv.classList.add(options.className);
    }
    messageDiv.innerHTML = message;
  } else {
    console.log(`Message div not found for message "${message}"`);
  }

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout);

  // Set the message timeout to clear after the delay if hide is true.
  if (options.hide && options.hide === true) {
    messageTimeout = setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.classList.remove(options.className);
    }, (options.hideDelay || HIDE_MESSAGE_DELAY));
  }
};
