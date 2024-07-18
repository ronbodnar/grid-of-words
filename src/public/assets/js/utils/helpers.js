import { buildGameView } from "../views/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";

/*
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} gameWord - The known word to compare against.
 * @return {list} - The in-order list of guessWord letters and their placement validation.
 */
function getValidatedLetters(guessWord, gameWord) {
  if (!guessWord || !gameWord) return null;
  if (guessWord.length != gameWord.length) return null;

  /*
   * Pretty simple really...
   * Just see if the first letter of the words is a match, if so push true meaning the word is CORRECTLY placed
   * If not, check to see if the gameWord contains the nth letter of the guessWord, if so push false, meaning.. you guessed it
   * .. the letter is in the word, but not in the right position.
   * If no conditions are met, the letter is not in the gameWord.
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

function showView(name, options) {
  console.log("Showing view", name);

  switch (name) {
    case "game":
      buildGameView({
        game: options.game,
        wordLength: options.wordLength,
        maxAttempts: options.maxAttempts,
        timed: options.timed,
      });
      break;

    case "how-to-play":
      console.log("hey");
      buildHowToPlayView();
      break;

    default:
      buildHomeView();
      break;
  }
}

function getCurrentViewName() {
  const currentView = document.querySelector('[id$="-container"]:not(.hidden)');
  return currentView.id.split("-")[0];
}

export { getValidatedLetters, showView, getCurrentViewName };
