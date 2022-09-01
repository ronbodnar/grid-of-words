import { buildView } from "../view/view.js"
import { buildLoaderElement } from "./loader.js"

/**
 * Builds and displays a loading view within the content container.
 */
export const buildLoadingView = () => {
  const message = document.createElement("p")
  message.textContent = "We'll be with you shortly"
  message.style.marginBottom = "20px"

  const loader = buildLoaderElement()
  loader.classList.add("loading-animation")

  buildView("loading", {
    hasNavigationButton: false,
    additionalElements: [message, loader],
  })
}
