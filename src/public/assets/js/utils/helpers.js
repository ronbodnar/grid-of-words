import { buildGameView } from "../views/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";
import { buildLoadingView } from "../views/loading.view.js";

/*
 * Compares two words of assumed equal length to see which guessWord letter positions match, are invalid, or don't exist in the gameWord.
 * @param {string} guessWord - The word to compare against the known correct word.
 * @param {string} gameWord - The known word to compare against.
 * @return {list} - The in-order list of guessWord letters and their placement validation.
 */
function getValidatedLetters(guessWord, actualWord) {
  if (!guessWord || !actualWord) return null;
  if (guessWord.length != actualWord.length) return null;

  // TODO: duplicate invalid letter edge case
  var results = [actualWord.length];
  var memo = {};
  for (var i = 0; i < guessWord.length; i++) {
    let guessLetter = guessWord.at(i);
    let actualLetter = actualWord.at(i);
    if (actualLetter === guessLetter) {
      // If the same letter was previously found and labeled as the wrong spot, that must be corrected.
      // Only if the correct word only has 1 occurrence of the letter.
      results[i] = 1;
    } else if (actualWord.includes(guessLetter)) {
      // If the letter was previously found in the correct spot and only 1 occurence exists, ignore it.
      results[i] = 2;
    } else {
      results[i] = 3;
    }
    // Add the letter position to index array of the letter in the memo.
    if (memo[guessLetter]) {
      memo[guessLetter].push(i);
    } else {
      memo[guessLetter] = [i];
    }
  }

  console.log(results.length, actualWord.length, guessWord.length);
  if (results.length != actualWord.length || actualWord.length != guessWord.length) {
    console.error(
      "Somehow the results array found differs from the chars in the word"
    );
    return null;
  }


  // If the result at index is 2
  for (var i = 0; i < guessWord.length; i++) {
    let positions = memo[guessWord[i]];
    if (results[i] === 1) { // exact match, set all other occurrences of the letter to 0
      for (var j = 0; j < positions.length; j++) {
        if (positions[j] === i) continue; // skip the current position
        results[positions[j]] = 0;
      }
    } else if (results[i] === 2) { // partial match
    }

    // If match and only one occurence found in ACTUAL word, set all positions to blank
    // If match and more than one occurence found in ACTUAL word
        // If more than one occurence found in GUESS word, 
  }


  console.log("Results: ", results);
  return results;
}

console.log("Validated Letters:", getValidatedLetters("lotol", "hello"));
// [ 2, 2, 3, 2, 2 ]


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
