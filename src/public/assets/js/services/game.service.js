import { remove, retrieve, store } from "./storage.service.js";
import { showView } from "../utils/helpers.js";
import { DEFAULT_WORD_LENGTH } from "../constants.js";

/*
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 */
const startGame = async (options) => {
  console.log("Starting game...");

  // Show the loading view
  showView("game", {
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
    const gameData = await fetchNewGame(params);

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

const forfeitGame = () => {
  const game = retrieve('game');
  console.log("Forfeiting game...", game);
  remove('game');
  showView("home");
}

const fetchNewGame = async (params) => {
  var response = await fetch(`/game/new?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

const fetchGameData = async (id) => {
  var response = await fetch(`/game/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export { startGame, forfeitGame, fetchGameData };
