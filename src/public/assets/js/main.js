import { retrieve, store } from "./services/storage.service.js";
import { initialize as initializeEventListeners } from "./event-listeners.js";
import { showView } from "./utils/helpers.js";
import { fetchGameData } from "./services/game.service.js";

// Initialize the listeners for key and button events.
initializeEventListeners();

// If the server has an existing session, the attribute will be populated.
var serverSessionGameId = document.querySelector("#initial-data");
console.log(serverSessionGameId);

// The server provided us a game session
if (serverSessionGameId && serverSessionGameId.length > 0) {
  showView("loading");
  fetchGameData(serverSessionGameId).then((gameData) => {
    store("game", gameData);
    showView("game", {
      game: gameData,
    });
  });
} else {
  // There is a game in local storage
  var game = retrieve("game");
  if (game != null) {
    showView("loading");
    showView("game", {
      game: game.data,
    });
  } else {
    showView("home");
  }
}
