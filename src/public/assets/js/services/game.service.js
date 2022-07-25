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
  });

  var params = new URLSearchParams({
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

const forfeitGame = async () => {
  const game = retrieve("game").data;
  console.log("Forfeiting game...", game);
  return fetch(`/game/${game.id}/forfeit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => response.json())
  .then((response) => {
    remove("game");
    showView("home");
  });
};

const fetchNewGame = async (params) => {
  return fetch(`/game/new?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
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
