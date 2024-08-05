import { getAuthenticatedUser, isAuthenticated } from "../services/authentication.service.js";
import { clickHowToPlayButton, clickLoginMessage, clickOptionsButton, clickStartGameButton } from "../services/event.service.js";
import { remove } from "../services/storage.service.js";

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
  message.style.fontSize = "18px";

  const buttonContainer = buildButtonContainer();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);
  contentContainer.appendChild(message);
  contentContainer.appendChild(buttonContainer);
};


/**
 * Builds the button container and creates the buttons for display.
 * 
 * @returns {Element} The button container element.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const startGameButton = document.createElement("button");
  startGameButton.classList.add("button", "fixed");
  startGameButton.type = "button";
  startGameButton.innerHTML = "<img src='/assets/material-icons/play-arrow.svg' style='vertical-align: -6px'> Start Game";
  startGameButton.addEventListener("click", clickStartGameButton);

  const howToPlayButton = document.createElement("button");
  howToPlayButton.classList.add("button", "fixed");
  howToPlayButton.type = "button";
  howToPlayButton.innerHTML = "<img src='/assets/material-icons/help.svg' style='vertical-align: -6px'> How to Play";
  howToPlayButton.addEventListener("click", clickHowToPlayButton);

  const optionsButton = document.createElement("button");
  optionsButton.classList.add("button", "fixed");
  optionsButton.innerHTML = "<img src='/assets/material-icons/tune.svg' style='vertical-align: -6px'> Options";
  optionsButton.addEventListener("click", clickOptionsButton);

  const loginMessage = document.createElement("p");
  loginMessage.classList.add("submessage");
  loginMessage.innerHTML = 'Want to save your progress?<br /><a id="loginButton">Log In</a> or <a id="registerButton">Register</a>';
  loginMessage.addEventListener("click", clickLoginMessage);

  if (isAuthenticated()) {
    loginMessage.innerHTML = `Welcome back, ${getAuthenticatedUser().username}! <a id="logoutButton">Log Out</a>`;
    loginMessage.addEventListener("click", () => {
      // TODO: server session destruction
      remove("user");
      window.location.reload();
    });
  }

  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(optionsButton);
  buttonContainer.appendChild(loginMessage);

  return buttonContainer;
};
