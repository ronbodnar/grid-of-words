import { showMessage } from "../../shared/services/message.service.js"
import {
  retrieveLocal,
  storeLocal,
} from "../../shared/services/storage.service.js"
import OPTIONS from "./enums/Options.js"

export const saveOptions = () => {
  let failedOptions = []

  Object.keys(OPTIONS).forEach((key) => {
    const option = OPTIONS[key]
    const optionContainer = document.querySelector(`#${option.id}-container`)
    const value = optionContainer?.firstChild?.value
    if (!value) {
      failedOptions.push(option.title)
      return
    }

    storeLocal(option.id, value)
  })

  if (failedOptions.length > 0) {
    showMessage(`Failed to save settings for: ${failedOptions.join(", ")}`, {
      className: "error",
      hide: false,
    })
  } else {
    showMessage("Settings saved successfully", {
      className: "success",
      hide: true,
    })
  }
}

export const loadOptions = () => {
  let failedOptions = []
  Object.keys(OPTIONS).forEach((key) => {
    const option = OPTIONS[key]

    // Find the preferred value for the option and return early if not found.
    const value = retrieveLocal(option.id)
    if (!value) {
      return
    }

    const optionContainer = document.querySelector(`#${option.id}-container`)
    if (optionContainer) {
      const inputElement = optionContainer.firstChild
      const valueLabelElement = optionContainer.lastChild
      const hasMultipleChildren = optionContainer.children.length > 1
      if (inputElement) {
        // Update the slider value/selected option
        inputElement.value = value

        // Update the slider value label
        if (hasMultipleChildren && valueLabelElement) {
          valueLabelElement.textContent = value
        }
      } else {
        failedOptions.push(option.title)
      }
    }
  })

  if (failedOptions.length > 0) {
    showMessage(`Failed to load settings for: ${failedOptions.join(", ")}`, {
      className: "error",
      hide: false,
    })
  }
}
