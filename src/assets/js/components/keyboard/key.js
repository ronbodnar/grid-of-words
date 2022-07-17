var keyboardKeys = {};

const initializeKeyboardKeys = () => {
  for (var i = 97; i <= 122; i++) {
    keyboardKeys[String.fromCharCode(i)] = undefined;
  }
};

/*
 * Finds a list of characters that are not included in the correct word of the game.
 * Is this the best you can do?
 * @param {Game} game - The game to search attempts for.
 */
const findIncorrectCharacters = (game) => {
  var incorrectCharacters = [];
  for (var i = 0; i < game.attempts.length; i++) {
    var attempt = game.attempts[i];
    for (var j = 0; j < attempt.length; j++) {
      if (!game.word.includes(attempt.at(j))) {
        if (!incorrectCharacters.includes(attempt.at(j))) {
          incorrectCharacters.push(attempt.at(j));
        }
      }
    }
  }
  return incorrectCharacters;
};

const updateKeyboardKey = (char) => {
  var key = getKeyboardKey(char);
  if (key !== undefined) {
    key.classList.toggle("pressed");
  }
};

const getKeyboardKey = (char, incorrect = false) => {
  if (keyboardKeys[char] === undefined) {
    var key = document.createElement("div");
    key.textContent = char;
    key.classList.add("keyboard-key");
    if (incorrect) {
      key.classList.add("incorrect");
    }
    keyboardKeys[char] = key;
    return keyboardKeys[char];
  } else {
    return keyboardKeys[char];
  }
};

export { getKeyboardKey, initializeKeyboardKeys };