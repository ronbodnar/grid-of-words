import { createButton } from "../../shared/components/button.js";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../auth/authentication.service.js";
import { handleClickEvent } from "../../shared/services/event.service.js";

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
  message.classList.add("message", "hidden");
  message.textContent = "";
  message.style.fontSize = "18px";

  const loginMessage = document.createElement("p");
  loginMessage.classList.add("submessage");
  loginMessage.innerHTML =
    'Want to save your progress?<br /><a id="showLogin">Log In</a> or <a id="showRegister">Register</a>';

  // Replace the message content with options for authenticated users.
  if (isAuthenticated()) {
    loginMessage.innerHTML = `Welcome back, ${
      getAuthenticatedUser().username
    }!<br /><a id="showChangePassword">Change Password</a> or <a id="logout">Log Out</a>`;
  }

  // Add the custom click event handler.
  loginMessage.addEventListener("click", handleClickEvent);

  const buttonContainer = buildButtonContainer();

  contentContainer.innerHTML = "";
  contentContainer.appendChild(header);
  contentContainer.appendChild(message);
  contentContainer.appendChild(buttonContainer);
  contentContainer.appendChild(loginMessage);
};

/**
 * Builds the button container and creates the buttons for display.
 *
 * @returns {Element} The button container element.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const startGameButton = createButton("Start Game", {
    icon: "play-arrow",
  });

  const howToPlayButton = createButton("How To Play", {
    icon: "help",
  });

  const optionsButton = createButton("Options", {
    icon: "tune",
  });

  buttonContainer.appendChild(startGameButton);
  buttonContainer.appendChild(howToPlayButton);
  buttonContainer.appendChild(optionsButton);

  return buttonContainer;
};
