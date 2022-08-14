import { removeSession, retrieveSession, storeSession } from "../../services/storage.service.js";
import { showView } from "../../services/view.service.js";
import { DEFAULT_WORD_LENGTH } from "../../utils/constants.js";
import { toggleKeyboardOverlay } from "../keyboard/keyboard.service.js";
import { showMessage } from "../../services/message.service.js";

// The current Game object if the user has a game in progress.
let currentGame;

/**
 * Fetches a new game from the API with the provided options.
 *
 * @param {Object} options - The options for the new game (wordLength, maxAttempts).
 * @returns {Promise<Game>} - A promise that resolves with the fetched game object.
 */
 // TODO: Add error handling for failed fetch
const fetchNewGame = async (options) => {
  return fetch(`/game/new?${options.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error fetching new game: ", error);
      return null;
    });
};

/**
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 * 
 * @param {Object} options - An object of options to pass when creating a game.
 */
export const startGame = async (options) => {
  //console.log("Starting game with options ", options);

  // Show the loading view while waiting for the game response from the server.
  showView("loading");

  var params = new URLSearchParams({
    wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
  });
  try {
    const fetchGameResponse = await fetchNewGame(params);

    //TODO: error handler
    if (!fetchGameResponse || fetchGameResponse.status === 'error') {
      console.log("Failed to fetch new game");
      showMessage("Failed to fetch new game");
      return;
    }

    showView("game", {
      wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    });

    // Add the game to localStorage
    storeSession("game", fetchGameResponse);

    console.log("Created Game Response", fetchGameResponse);
  } catch (error) {
    console.error(error);
    showMessage("An unknown error has occurred. Please try again.");
  }
};

export const forfeitGame = async () => {
  const game = retrieveSession("game");

  showMessage("Forfeiting game - please wait.");
  toggleKeyboardOverlay();

  return fetch(`/game/${game.id}/forfeit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      removeSession("game");
      showView("home");
      return null;
    });
};

export const fetchGameData = async (id) => {
  try {
    var response = await fetch(`/game/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.log(`Failed to fetch game data for id ${id}`, error);
    return null;
  }
};

export const getCurrentGame = () => {
  return currentGame;
}

export const setCurrentGame = (game) => {
  currentGame = game;
}
