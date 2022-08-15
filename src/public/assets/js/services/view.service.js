import { buildChangePasswordView } from "../features/auth/change-password/change-password.view.js";
import { buildForgotPasswordView } from "../features/auth/forgot-password/forgot-password.view.js";
import { buildLoginView } from "../features/auth/login/login.view.js";
import { buildRegisterView } from "../features/auth/register/register.view.js";
import { buildResetPasswordView } from "../features/auth/reset-password/reset-password.view.js";
import { buildGameView } from "../features/game/game.view.js";
import { buildHomeView } from "../views/home.view.js";
import { buildHowToPlayView } from "../views/how-to-play.view.js";
import { buildLoadingView } from "../views/loading.view.js";
import { buildOptionsView } from "../views/options.view.js";
import { retrieveSession } from "./storage.service.js";

// The stack of views so that the back button can return the user to where they were (does not keep previous states).
let viewHistory = [];

/**
 * Clears the current content container's innerHTML and builds view containers.
 * @param {string} name - The name of the view container to build and display.
 * @param {object} options - A list of options that can be passed to views.
 */
// TODO: Lets convert this into a ViewManager later on.
export const showView = (name, options) => {
  // If no name is provided we will just show the home view.
  if (!name || name === "") {
    showView("home");
    return;
  }

  // Do not add to history when current view is "loading" or "game", or when options.hideFromHistory is true.
  if (
    getCurrentViewName() !== "loading" &&
    getCurrentViewName() !== "game" &&
    !options?.hideFromHistory
  ) {
    viewHistory.push(getCurrentViewName());
  }

  switch (name) {
    case "game":
      buildGameView({
        game: options.game,
        wordLength: options.wordLength,
        maxAttempts: options.maxAttempts,
      });

      // Reset the view history
      viewHistory = [];
      break;

    case "how-to-play":
      buildHowToPlayView();
      break;

    case "loading":
      buildLoadingView();
      break;

    case "options":
      buildOptionsView();
      break;

    case "login":
      buildLoginView(options?.message || undefined);
      break;

    case "register":
      buildRegisterView();
      break;

    case "forgot-password":
      buildForgotPasswordView(options?.message || undefined);
      break;

    case "reset-password":
      const passwordResetToken = retrieveSession("passwordResetToken");
      if (!passwordResetToken) {
        console.error("No reset token provided");
        //TODO: the user experience
        return;
      }
      buildResetPasswordView();
      break;

    case "change-password":
      buildChangePasswordView();
      break;

    default:
      buildHomeView();

      // Reset the view history
      viewHistory = [];
      break;
  }
};

/**
 * Retrieves the current view from the id tag of the main content container.
 * @return {string} - The name of the current view.
 */
export const getCurrentViewName = () => {
  const currentView = document.querySelector(".content");
  return currentView?.id;
};

export const getViewHistory = () => {
    return viewHistory;
}