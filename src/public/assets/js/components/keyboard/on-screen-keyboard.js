import { getKeyboardKey, initializeKeyboardKeys } from "./key.js";

/*
 * Gets the rendered keyboard element.
 * @param {Game} game - The game to render the keyboard for.
 */
const getOnScreenKeyboard = (game) => {
  var rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
  ];

  initializeKeyboardKeys(game);

  var keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");

  for (var i = 0; i < rows.length; i++) {
    var row = document.createElement("div");
    row.classList.add("keyboard-row");

    for (var j = 0; j < rows[i].length; j++) {
      var key = getKeyboardKey(rows[i][j]);

      row.appendChild(key);
    }
    keyboard.appendChild(row);
  }

  return keyboard;
};



/*
 * Finds a list of letters that are not included in the correct word of the game.
 * Is this the best you can do?
 * @param {Game} game - The game to search attempts for.
 */
const getIncorrectLetters = (word, attemptedWords) => {
  var incorrectLetters = [];
  console.log(attemptedWords);
  for (var i = 0; i < attemptedWords.length; i++) {
    var attempt = attemptedWords[i];
    for (var j = 0; j < attempt.length; j++) {
      if (!word.includes(attempt.at(j))) {
        if (!incorrectLetters.includes(attempt.at(j))) {
          incorrectLetters.push(attempt.at(j));
        }
      }
    }
  }
  return incorrectLetters;
};

export { getOnScreenKeyboard, getIncorrectLetters };
