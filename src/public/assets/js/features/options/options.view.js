import { getRandomInt } from "../../shared/utils/helpers.js"
import {
  MINIMUM_WORD_LENGTH,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_MAX_ATTEMPTS,
  MAXIMUM_MAX_ATTEMPTS,
} from "../../shared/utils/constants.js"
import { createButton } from "../../shared/components/button.js"
import { buildView } from "../view/view.js"
import { buildOptionSection } from "./components/option-section.js"
import OPTIONS from "./enums/options.js"
import { loadOptions } from "./options.service.js"

/**
 * Builds and displays the options view.
 */
export const buildOptionsView = () => {
  buildView("options", {
    header: {
      text: "Game Options",
    },
    message: {
      styles: {
        fontSize: "18px",
      },
    },
    additionalElements: [buildOptionsContainer(), buildButtonContainer()],
  })
  loadOptions()
}

/**
 * Builds the options container that houses the word length and max attempt sliders.
 *
 * @returns {Element} The built options container.
 */
const buildOptionsContainer = () => {
  const optionsContainer = document.createElement("div")
  optionsContainer.classList.add("options-container")

  Object.keys(OPTIONS).forEach((key) => {
    const option = OPTIONS[key]
    optionsContainer.appendChild(buildOptionSection(option))
  })

  return optionsContainer
}

/**
 * Builds the button container with the back, start game, and random game buttons.
 *
 * @returns {Element} The built button container.
 */
const buildButtonContainer = () => {
  const buttonContainer = document.createElement("div")
  buttonContainer.classList.add("button-container")

  const saveOptionsButton = createButton("Save Options", {
    icon: "save",
  })

  const randomGameButton = createButton("Random Game", {
    id: "startGame",
    icon: "shuffle",
    eventArgs: {
      wordLength: getRandomInt(MINIMUM_WORD_LENGTH, MAXIMUM_WORD_LENGTH),
      maxAttempts: getRandomInt(MINIMUM_MAX_ATTEMPTS, MAXIMUM_MAX_ATTEMPTS),
    },
  })

  buttonContainer.appendChild(saveOptionsButton)
  buttonContainer.appendChild(randomGameButton)

  return buttonContainer
}
