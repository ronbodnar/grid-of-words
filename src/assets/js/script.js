/*
 * User loads the route
 * Check if there is an active game in history, if so, load the game view
 * If no active game is found, show the home view.
 *
 * When the user clicks the start button or presses enter, fetch a new game and load the game view
 * When the user clicks the "Game Options" button, show a collapsable div with the game options.
 * When the user clicks the "How to Play" button, show a modal with the game instructions.
 *
 *
 * Game board:
 * Create a "Letter(?)" instance and the board will be a "Letter(?)" grid of maxAttempts X wordLength
 * Each row is an "Attempt", except for the top-most open row, which will house the current word
 * The current "word" will be stored in a stack of characters for efficiency... word = ['w', 'o', 'r', 'd']
 * ... both in ease of typing/deleting, and validating placement of characters in the word
 */
const addButtonListeners = () => {
  const button = document.querySelector("#quickGame");
  if (button) {
    button.addEventListener("click", start);
  }
};

// 
const addKeyListener = () => {
  document.addEventListener("keypress", function (event) {
    const key = event.key;

    // Block any key input that isnt an alpha character
    if (/^[^a-zA-Z]/.test(key)) {
      console.log("Invalid key:", key);
      return;
    }

    // Find all available squares (active is set by the server)
    var squares = document.querySelectorAll(".square:is(.active):not(.full)");

    // Enter should be blocked, but if there are no squares available (word is complete), let the server know.
    if (key === "Enter") {
        if (!squares[0]) {
            console.log("hey");
        }
        return;
    }

    // Ensure there's a square available, update the square properties, and add it to our stack of letters.
    if (squares[0]) {
      squares[0].classList.add("full");
      squares[0].children[0].innerHTML = key.toUpperCase();
      attemptLetters.push(key);
    }
  });
  document.addEventListener("keydown", function (event) {
    const key = event.key;

    // Find all available squares (active is set by the server)
    var squares = document.querySelectorAll(".square:is(.active):is(.full)");

    // If there are letters, adjust the square properties and remove the pop the letter off the stack of letters.
    if (key === "Backspace" || key === "Delete") {
      if (attemptLetters.length > 0) {
        squares[attemptLetters.length - 1].classList.remove("full");
        squares[attemptLetters.length - 1].children[0].innerHTML = "";
        attemptLetters.pop();
      }
    }
  });
};

addKeyListener();
addButtonListeners();
