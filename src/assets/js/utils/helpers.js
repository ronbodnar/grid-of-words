import { renderGameContainer } from "../components/game-container.js";

/*
 * Compares two words of assumed equal length to see which guessWord character positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} gameWord - The known word to compare against.
 * @return {list} - The in-order list of guessWord characters and their placement validation.
 */
function getValidatedCharacters(guessWord, gameWord) {
  if (!guessWord || !gameWord) return null;
  if (guessWord.length != gameWord.length) return null;

  /*
   * Pretty simple really...
   * Just see if the first character of the words is a match, if so push true meaning the word is CORRECTLY placed
   * If not, check to see if the gameWord contains the nth character of the guessWord, if so push false, meaning.. you guessed it
   * .. the character is in the word, but not in the right position.
   * If no conditions are met, the character is not in the gameWord.
   */
  // TODO: duplicate invalid letter edge case
  var results = [];
  for (var i = 0; i < guessWord.length; i++) {
    if (gameWord.at(i) === guessWord.at(i)) results.push(true);
    else if (gameWord.includes(guessWord.at(i))) results.push(false);
    else results.push(undefined);
  }
  return results;
}

function showContainerView(name, game = undefined) {
  const currentView = document.querySelector(
    '[id$="-container"]:has(:not(.hidden))'
  );
  currentView.classList.add("hidden");

  const newView = document.querySelector(`#${name}-container`);
  newView.classList.remove("hidden");

  if (name === "game") {
    if (game) {
      renderGameContainer(game);
    } else {
      console.error("no game found");
      // TODO: error handling
    }
  }
}

export { getValidatedCharacters, showContainerView };
