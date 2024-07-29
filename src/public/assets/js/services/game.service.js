import { remove, retrieve, store } from "./storage.service.js";
import { showView } from "../utils/helpers.js";
import { DEFAULT_WORD_LENGTH } from "../constants.js";
import { toggleKeyboardOverlay } from "./keyboard.service.js";
import { showMessage } from "./message.service.js";

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
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
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
 */
export const startGame = async (options) => {
  console.log("Starting game with options ", options);

  // Show the loading view with a 500ms delay
  let timeout = setTimeout(() => showView("loading"), 500);

  var params = new URLSearchParams({
    wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
  });
  try {
    const gameData = await fetchNewGame(params);

    // Stop the loading screen if the game data was already loaded
    clearTimeout(timeout);

    //TODO: error handler
    if (!gameData) {
      console.log("Failed to fetch new game");
      showMessage("Failed to fetch new game");
      return;
    }

    showView("game", {
      wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    });

    // Add the game to localStorage
    store("game", gameData);

    console.log("Created Game Response", gameData);
  } catch (error) {
    console.error(error);
    showMessage("An unknown error has occurred. Please try again.");
  }
};

export const forfeitGame = async () => {
  const game = retrieve("game");

  console.log("Forfeiting game...", game);

  showMessage("Forfeiting game - please wait.");
  toggleKeyboardOverlay();

  return fetch(`/game/${game.id}/forfeit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
  })
    .then((response) => response.json())
    .then(() => {
      remove("game");
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
        Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
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
