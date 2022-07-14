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
    const button = document.querySelector('#quickGame');
    if (button) {
        button.addEventListener('click', start);
    }
}

const addKeyListener = () => {
    document.addEventListener('keypress', function (event) {
        const key = event.key;
        if (key === 'Enter') { // just getting started
            start();
        }
    });
}

addKeyListener();
addButtonListeners();