import { retrieve, store } from "./services/storage.service.js";
import { addKeyListeners } from "./services/event.service.js";
import { showView } from "./utils/helpers.js";
import { fetchWordList } from "./services/word.service.js";

// Initialize the listeners for keyboard events.
addKeyListeners();

// Ensure the user has the word list in the local storage, if not, asynchronously fetch and store the word list.
const wordList = retrieve("wordList");
if (!wordList) {
  fetchWordList()
    .then((response) => store("wordList", response))
    .catch((error) => console.error("Error fetching word list", error));
}

// Check to see if we have a local game in progress, otherwise check with the server.
// (Need to check with the server anyways for good measure, but non-blocking)
const cachedGame = retrieve("game");
if (cachedGame) {
  showView("game", {
    game: cachedGame,
  });
} else {
  // Show the loading view while we fetch session data from the server.
  showView("loading");

  // Fetch the session data from the server.
  const serverData = await fetch("/session", {
    headers: {
      Authorization: "Bearer v5Pd3vUK9iYjRxCa1H5VsBe9L18xs8UW", // :)
    },
  });

  // Parse the JSON response from the server.
  const sessionData = await serverData.json();

  // We received session data that contains a game.
  if (sessionData && sessionData.game) {
    console.log("Received session data: ", sessionData);
    store("game", sessionData.game);
    showView("game", {
      game: sessionData.game,
    });
  } else {
    showView("home");
  }
}
