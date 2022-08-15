import { createButton } from "../components/button.js";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../services/authentication.service.js";

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

  const startGameButton = createButton("Start Game", "startGame", {
    icon: "play-arrow",
  });

  const howToPlayButton = createButton("How To Play", "howToPlay", {
    icon: "help",
  });

  const optionsButton = createButton("Options", "options", {
    icon: "tune",
  });

  const loginMessage = document.createElement("p");
  loginMessage.classList.add("submessage");
  loginMessage.innerHTML =
    'Want to save your progress?<br /><a id="showLoginViewButton">Log In</a> or <a id="Button">Register</a>';
  //loginMessage.addEventListener("click", clickLoginMessage);

  if (isAuthenticated()) {
    loginMessage.innerHTML = `Welcome back, ${
      getAuthenticatedUser().username
    }!<br /><a id="changePassword">Change Password</a> or <a id="logoutButton">Log Out</a>`;
  }

  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(optionsButton);
  buttonContainer.appendChild(loginMessage);

  return buttonContainer;
};
