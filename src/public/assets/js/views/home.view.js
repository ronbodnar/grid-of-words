import { showView } from "../utils/helpers.js";
import { startGame } from "../services/game.service.js";
import { DEFAULT_WORD_LENGTH, DEFAULT_MAX_ATTEMPTS } from "../constants.js";

/*
 *
 */
const buildHomeContainer = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "home";

  const header = document.createElement("h1");
  header.textContent = "Word Game";

  const informationContainer = document.createElement("div");
  informationContainer.classList.add("information-container");

  // make this buttonContainer a module
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const howToPlayButton = document.createElement("button");
  howToPlayButton.classList.add("button", "fixed");
  howToPlayButton.type = "button";
  howToPlayButton.textContent = "How to Play";
  howToPlayButton.addEventListener("click", () => {
    showView('how-to-play');
  });

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.textContent = "Start Game";
  startGameButton.addEventListener("click", () => {
    startGame({
      wordLength: DEFAULT_WORD_LENGTH,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      timed: false,
      language: "enUS",
    });
  });

  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(startGameButton);

  contentContainer.innerHTML = '';
  contentContainer.appendChild(header);
  //contentContainer.appendChild(informationContainer);
  contentContainer.appendChild(buttonContainer);
};

export { buildHomeContainer as buildHomeView };
