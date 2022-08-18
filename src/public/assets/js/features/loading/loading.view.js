import { buildView } from "../view/view.js";
import { buildLoadingElement } from "./loading.js";

/**
 * Builds and displays a loading view within the content container.
 */
export const buildLoadingView = () => {
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "We'll be with you shortly";
  loadingMessage.style.marginBottom = "20px";

  const loadingAnimation = buildLoadingElement();
  loadingAnimation.classList.add("loading-animation");
  
  buildView("loading", {
    title: "Loading...",
    additionalElements: [loadingMessage, loadingAnimation],
  });
};