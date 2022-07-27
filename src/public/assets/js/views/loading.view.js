import { getLoader } from "../components/loader.js";

/*
 * Builds and displays the loading view.
 */
export const buildLoadingView = () => {
  const contentContainer = document.querySelector(".content");
  contentContainer.id = "loading";

  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "We'll be with you shortly";
  loadingMessage.style.marginBottom = "20px";

  const loadingAnimation = getLoader();
  loadingAnimation.classList.add("loading-animation");

  contentContainer.innerHTML = "";
  contentContainer.appendChild(loadingMessage);
  contentContainer.appendChild(loadingAnimation);
};
