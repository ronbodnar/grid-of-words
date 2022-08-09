// TODO: Eventually do a queue system here to stack up the messages?

import { HIDE_MESSAGE_DELAY } from "../constants.js";

// Used to clear any existing message timeouts.
let messageTimeout = undefined;

/**
 * Update the message container in the current view (home or game) and sets a timeout to hide after a delay.
 *
 * @param {String} message - The message to show.
 * @param {boolean} hide - Whether to hide the message automatically after a delay.
 * @param {Number} delay - The delay to hide the message if hide is set to true, in milliseconds.
 */
export const showMessage = (message, hide = true, hideDelay = HIDE_MESSAGE_DELAY) => {
  if (message.length < 1) return;

  console.log(`Showing message "${message}" with a ${hideDelay}ms delay`);

  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) {
    messageDiv.classList.remove("hidden");
    messageDiv.innerHTML = message;
  } else {
    console.log(`Message div not found for message "${message}"`);
  }

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout);

  // Set the message timeout to clear after the delay if hide is true.
  if (hide) {
    messageTimeout = setTimeout(() => {
      messageDiv.textContent = "";
    }, hideDelay);
  }
};
