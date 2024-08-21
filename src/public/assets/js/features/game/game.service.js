import {
  removeSession,
  retrieveSession,
  storeSession,
} from "../../shared/services/storage.service.js";
import { showView } from "../view/view.service.js";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
} from "../../shared/utils/constants.js";
import { toggleKeyboardOverlay } from "../keyboard/keyboard.service.js";
import { showMessage } from "../../shared/services/message.service.js";
import { fetchData } from "../../shared/services/api.service.js";
import { logger } from "../../main.js";
import { Game } from "./Game.js";

/**
 * Begins a new game by querying the API for a new game object, then swaps the container view to show the game container.
 *
 * @param {Object} options - An object of options to pass when creating a game.
 */
export const startGame = async (options = {}) => {
  showView("loading");

  const {
    wordLength,
    maxAttempts,
  } = options;

  var params = new URLSearchParams({
    wordLength: wordLength || DEFAULT_WORD_LENGTH,
    maxAttempts: maxAttempts || DEFAULT_MAX_ATTEMPTS,
  });
  try {
    const fetchNewGameResponse = await fetchData(
      `/game/new?${params.toString()}`,
      "GET"
    );

    if (!fetchNewGameResponse || fetchNewGameResponse.statusCode !== 200) {
      throw new Error("Failed to fetch a new game");
    }

    showView("game", {
      wordLength: wordLength || DEFAULT_WORD_LENGTH,
      maxAttempts: maxAttempts || DEFAULT_MAX_ATTEMPTS,
    });

    storeSession("game", fetchNewGameResponse);

    logger.info("Created Game Response", fetchNewGameResponse);
  } catch (error) {
    logger.error("Error creating new game", {
      error: error,
    });
    showView("home", {
      message: {
        text: "An unknown error has occurred. Please try again.",
        className: "error",
        hideDelay: 10000,
      },
    });
  }
};

/**
 * Forfeits the current game by sending a request to the server and updating the UI.
 * 
 * @async
 * @returns {Object|undefined} The response from the server if the game was forfeited successfully, or `undefined` if there was an error.
 */
export const forfeitGame = async () => {
  const game = retrieveSession("game");

  showMessage("Forfeiting game - please wait.");
  toggleKeyboardOverlay();

  const forfeitGameResponse = await fetchData(
    `/game/${game._id}/forfeit`,
    "POST"
  );

  if (!forfeitGameResponse || forfeitGameResponse.statusCode !== 200) {
    logger.error("Failed to forfeit game", {
      game: game,
      forfeitGameResponse: forfeitGameResponse,
    });
    showMessage("Failed to forfeit game");
    toggleKeyboardOverlay();
    return;
  }

  removeSession("game");
  showView("home");

  return forfeitGameResponse;
};

let currentGame;

/**
 * @returns The current Game object.
 */
export const getCurrentGame = () => {
  return currentGame;
};

/**
 * Sets the current Game object.
 * @param {Game} game The current Game object to set. 
 */
export const setCurrentGame = (game) => {
  currentGame = game;
};
