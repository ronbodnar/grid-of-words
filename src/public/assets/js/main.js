import { retrieve, store } from "./services/storage.service.js";
import { buildGameContainer } from "./views/game.js";
import { initialize as initializeEventListeners } from "./event-listeners.js";
import { showContainerView } from "./utils/helpers.js";
import { fetchGameData } from "./services/game.service.js";

// Initialize the listeners for key and button events.
initializeEventListeners();

// If the server has an existing session, the attribute will be populated.
var serverSessionGameId = document
  .querySelector("#game-container")
  ?.getAttribute("data-game-id");

// The server provided us a game session
if (serverSessionGameId && serverSessionGameId.length > 0) {
  showContainerView("loading");
  fetchGameData(serverSessionGameId).then((gameData) => {
    store("game", gameData);
    showContainerView("game", {
      game: gameData,
    });
  });
} else {
  // There is a game in local storage
  var game = retrieve("game");
  if (game != null) {
    showContainerView("loading");
    showContainerView("game", {
      game: game.data,
    });
  } else {
    showContainerView("home");
  }
}
