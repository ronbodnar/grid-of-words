import { clickHowToPlayButton, clickOptionsButton, clickStartGameButton } from "../services/event.service.js";

/**
 * Builds the home container view within the content container.
 */
export const buildHomeView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "home";

  const header = document.createElement("h1");
  header.classList.add("view-header");
  header.textContent = "Word Puzzle Game";

  const message = document.createElement("p");
  message.classList.add("message");
  message.textContent = "";

  const buttonContainer = buildButtonContainer();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);
  contentContainer.appendChild(message);
  contentContainer.appendChild(buttonContainer);
};


/**
 * Builds the button container and creates the buttons for display.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const howToPlayButton = document.createElement("button");
  howToPlayButton.classList.add("button", "fixed");
  howToPlayButton.type = "button";
  howToPlayButton.innerHTML = "<img src='/assets/material-icons/help.svg' style='vertical-align: -6px'> How to Play";
  howToPlayButton.addEventListener("click", clickHowToPlayButton);

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("button", "fixed");
  optionsButton.innerHTML = "<img src='/assets/material-icons/tune.svg' style='vertical-align: -6px'> Options";
  optionsButton.addEventListener("click", clickOptionsButton);

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.innerHTML = "<img src='/assets/material-icons/play-arrow.svg' style='vertical-align: -6px'> Start Game";
  startGameButton.addEventListener("click", clickStartGameButton);

  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(optionsButton);

  return buttonContainer;
};
