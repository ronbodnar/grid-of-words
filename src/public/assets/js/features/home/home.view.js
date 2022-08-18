import { createButton } from "../../shared/components/button.js";
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../auth/authentication.service.js";
import { buildView } from "../view/view.js";

/**
 * Builds the home container view within the content container.
 */
export const buildHomeView = () => {
  // Set the submessage inviting the user to log in or register.
  // If the user is already authenticated, they're shown change password/logout links.
  let submessageText =
    'Want to save your progress?<br /><a id="showLogin">Log In</a> or <a id="showRegister">Register</a>';
  if (isAuthenticated()) {
    submessageText = `Welcome back, ${
      getAuthenticatedUser().username
    }!<br /><a id="showChangePassword">Change Password</a> or <a id="logout">Log Out</a>`;
  }

  buildView("home", {
    header: {
      text: "Word Puzzle Game"
    },
    message: {
      hidden: true,
    },
    submessage: {
      text: submessageText,
    },
    hasNavigationButton: false,
    additionalElements: [buildButtonContainer()],
  });
};

/**
 * Builds the button container and creates the buttons for display.
 *
 * @returns {Element} The button container element.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Add the Start Game, How To Play, and Options buttons to the button container.
  buttonContainer.appendChild(
    createButton("Start Game", {
      icon: "play-arrow",
    })
  );

  buttonContainer.appendChild(
    createButton("How To Play", {
      icon: "help",
    })
  );
  buttonContainer.appendChild(
    createButton("Options", {
      icon: "tune",
    })
  );

  return buttonContainer;
};
