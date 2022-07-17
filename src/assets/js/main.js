import { retrieve } from "./services/storage.service.js";
import { buildGameContainer } from "./components/game-container.js";
import { initialize as initializeEventListeners } from "./event-listeners.js";

// Initialize the listeners for key and button events.
initializeEventListeners();

// Find any games in the localStorage and render the game container for that game.
// Not the best way, should be determined by the server.
var game = retrieve("game");
if (game != null) buildGameContainer(game.data);
