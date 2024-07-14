import { store } from "./storage.service.js";
import { showContainerView } from "../utils/helpers.js";

/*
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 */
const startGame = async () => {
  console.log("Starting game...");
  var params = new URLSearchParams({
    timed: false,
    wordLength: 5,
    maxAttempts: 6,
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

    showContainerView("game", gameData);
  } catch (error) {
    console.error(error);
  }
};

export { startGame };
