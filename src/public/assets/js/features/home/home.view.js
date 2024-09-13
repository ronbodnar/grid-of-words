import { createButton } from "../../shared/components/button.js"
import { showMessage } from "../../shared/services/message.service.js"
import { retrieveSession } from "../../shared/services/storage.service.js"
import {
  getAuthenticatedUser,
  isAuthenticated,
} from "../auth/authentication.service.js"
import { buildView } from "../view/view.js"

/**
 * Builds the home container view within the content container.
 */
export const buildHomeView = (options) => {
  let submessageText =
    'Want to save your progress?<br /><a id="showLogin">Log In</a> or <a id="showRegister">Register</a>'
  if (isAuthenticated()) {
    submessageText = `Welcome back, ${
      getAuthenticatedUser().username
    }!<br /><a id="showChangePassword">Change Password</a> or <a id="logout">Log Out</a>`
  }

  const message = options?.message

  buildView("home", {
    header: {
      text: "Word Puzzle Game",
    },
    message: {
      hide: false,
    },
    submessage: {
      text: submessageText,
      emitClickEvent: true,
    },
    hasNavigationButton: false,
    additionalElements: [buildButtonContainer()],
  })

  if (message) {
    const options = {
      hide: message.hide || true,
      hideDelay: message.hideDelay || 3000,
      className: message.className,
    }
    showMessage(message.text, options)
  }
}

/**
 * Builds the button container and creates the buttons for display.
 *
 * @returns {Element} The button container element.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div")
  buttonContainer.classList.add("button-container")

  buttonContainer.appendChild(
    createButton("Start Game", {
      icon: "play-arrow",
    })
  )

  buttonContainer.appendChild(
    createButton("How To Play", {
      icon: "help",
    })
  )

  if (isAuthenticated()) {
    buttonContainer.appendChild(
      createButton("Statistics", {
        icon: "bar-chart",
      })
    )
  }

  buttonContainer.appendChild(
    createButton("Options", {
      icon: "tune",
    })
  )

  return buttonContainer
}
