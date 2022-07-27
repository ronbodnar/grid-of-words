import { remove, retrieve, store } from "./storage.service.js";
import { showView } from "../utils/helpers.js";
import { DEFAULT_WORD_LENGTH } from "../constants.js";
import { updateHomeMessage } from "../views/home.view.js";
import { toggleKeyboardOverlay } from "../components/keyboard/on-screen-keyboard.js";
import { showMessage } from "./message.service.js";

/*
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 */
const startGame = async (options) => {
  console.log("Starting game...");

  // Show the loading view
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
      updateHomeMessage("Failed to fetch new game");
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
    updateHomeMessage("An unknown error has occurred. Please try again.");
  }
};

const forfeitGame = async () => {
  const game = retrieve("game").data;

  console.log("Forfeiting game...", game);

  showMessage("Forfeiting game - please wait.")
  toggleKeyboardOverlay();

  return fetch(`/game/${game.id}/forfeit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      remove("game");
      showView("home");
      return null;
    });
};

const fetchNewGame = async (params) => {
  return fetch(`/game/new?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error fetching new game: ", error);
      //showView("home");
      return null;
    });
};

const fetchGameData = async (id) => {
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

export { startGame, forfeitGame, fetchGameData };
