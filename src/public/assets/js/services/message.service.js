// TODO: Eventually do a queue system here to stack up the messages?

import { HIDE_MESSAGE_DELAY } from "../constants.js";

// Used to clear any existing message timeouts.
let messageTimeout = undefined;

/**
 * Update the message container in the current view (home or game) and sets a timeout to hide after a delay.
 *
 * @param {String} message - The message to show.
 */
export const showMessage = (message, hide = true) => {
  if (message.length < 1) return;

  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) {
    messageDiv.classList.remove("hidden");
    messageDiv.textContent = message;
  }

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout);

  // Set the message timeout to clear after the delay if hide is true.
  if (hide) {
    messageTimeout = setTimeout(() => {
      messageDiv.textContent = "";
    }, HIDE_MESSAGE_DELAY);
  }
};
