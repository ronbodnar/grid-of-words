import { store } from "./storage.service.js";
import { showContainerView } from "../utils/helpers.js";
import { DEFAULT_WORD_LENGTH } from "../constants.js";

/*
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 */
const startGame = async (options) => {
  console.log("Starting game...");

  // Show the loading view
  showContainerView("game", {
    wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    timed: options.timed || false,
  });

  var params = new URLSearchParams({
    timed: options.timed || false,
    wordLength: options.wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: options.maxAttempts || DEFAULT_MAX_ATTEMPTS,
    render: true,
  });
  try {
    var response = await fetch(`/game/new?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const gameData = await response.json();

    //TODO: error handler
    if (!gameData) throw new Error("Make an error handler");

    // Add the game to localStorage
    store("game", gameData);

    console.log("gamedata response", gameData);

    //showContainerView("game", gameData);
  } catch (error) {
    console.error(error);
  }
};

export { startGame };
