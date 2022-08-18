import { removeSession, retrieveSession, storeSession } from "../../shared/services/storage.service.js";
import { showView } from "../view/view.service.js";
import { DEFAULT_MAX_ATTEMPTS, DEFAULT_WORD_LENGTH } from "../../shared/utils/constants.js";
import { toggleKeyboardOverlay } from "../on-screen-keyboard/keyboard.service.js";
import { showMessage } from "../../shared/services/message.service.js";
import { fetchData } from "../../shared/services/api.service.js";

// The current Game object if the user has a game in progress.
let currentGame;

/**
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 * 
 * @param {Object} options - An object of options to pass when creating a game.
 */
export const startGame = async (options) => {
  //console.log("Starting game with options ", options);

  // Show the loading view while waiting for the game response from the server.
  showView("loading");

  options = options || {};

  var params = new URLSearchParams({
    wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
  });
  try {
    const fetchNewGameResponse = await fetchData(`/game/new?${params.toString()}`, "GET");

    //TODO: error handler
    if (!fetchNewGameResponse || fetchNewGameResponse.statusCode !== 200) {
      console.log("Failed to fetch new game");
      showMessage("Failed to fetch new game");
      return;
    }

    showView("game", {
      wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    });

    // Add the game to localStorage
    storeSession("game", fetchNewGameResponse);

    console.log("Created Game Response", fetchNewGameResponse);
  } catch (error) {
    console.error(error);
    showMessage("An unknown error has occurred. Please try again.");
  }
};

export const forfeitGame = async () => {
  const game = retrieveSession("game");

  showMessage("Forfeiting game - please wait.");
  toggleKeyboardOverlay();

  const forfeitGameResponse = await fetchData(`/game/${game.id}/forfeit`, "POST");

  if (!forfeitGameResponse || forfeitGameResponse.statusCode !== 200) {
    console.log("Failed to forfeit game", {
      game: game,
      forfeitGameResponse: forfeitGameResponse,
    });
    showMessage("Failed to forfeit game");
    return;
  }

  removeSession("game");
  showView("home");
  
  return forfeitGameResponse;
};

export const getCurrentGame = () => {
  return currentGame;
}

export const setCurrentGame = (game) => {
  currentGame = game;
}
