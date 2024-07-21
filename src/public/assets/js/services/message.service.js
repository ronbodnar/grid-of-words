// Eventually do a queue system here to stack up the messages?

let messageTimeout = undefined;

const showMessage = (message) => {
  if (message.length < 1) return;

  // Update the message div with the response message
  var messageDiv = document.querySelector(".message");
  if (messageDiv && message) messageDiv.textContent = message;

  // Clear the previous message timeout to restart the hide delay
  if (messageTimeout) clearTimeout(messageTimeout);

  // Add the timeout to hide the message after 5 seconds.
  messageTimeout = setTimeout(() => {
    messageDiv.textContent = "";
  }, 2500);
};

export { showMessage };