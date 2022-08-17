import { buildLoadingElement } from "./loading.js";

/**
 * Builds and displays a loading view within the content container.
 */
export const buildLoadingView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "loading";

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "We'll be with you shortly";
  loadingMessage.style.marginBottom = "20px";

  const loadingAnimation = buildLoadingElement();
  loadingAnimation.classList.add("loading-animation");

  contentContainer.innerHTML = "";
  contentContainer.appendChild(loadingMessage);
  contentContainer.appendChild(loadingAnimation);
};