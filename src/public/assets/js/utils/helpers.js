import { buildGameView } from "../views/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";
import { buildLoadingView } from "../views/loading.view.js";

/*
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} targetWord - The known word to compare against.
 * @return {list} - The in-order list of the guessWord letters placement validation.
 */
function getValidatedLetters(guessWord, targetWord) {
  if (targetWord.length !== guessWord.length) {
    console.error("Words must be of the same length");
    return null;
  }

  const length = targetWord.length;
  const results = new Array(length).fill(3);
  const targetCount = {};
  const usedCount = {};

  // Populate targetCount with the frequency of each character in targetWord
  for (let i = 0; i < length; i++) {
    const char = targetWord[i];
    targetCount[char] = (targetCount[char] || 0) + 1;
  }

  // Perform a pass for all correctly positioned letters
  for (let i = 0; i < length; i++) {
    if (guessWord[i] === targetWord[i]) {
      results[i] = 1;
      targetCount[guessWord[i]]--;
    }
  }

  // Perform a pass for all incorrectly positioned letters
  for (let i = 0; i < length; i++) {
    if (results[i] === 1) continue;

    const char = guessWord[i];

    if (targetCount[char] > (usedCount[char] || 0)) {
      results[i] = 2;
      usedCount[char] = (usedCount[char] || 0) + 1;
    }
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
      buildHowToPlayView();
      break;

    case "loading":
      buildLoadingView();
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
