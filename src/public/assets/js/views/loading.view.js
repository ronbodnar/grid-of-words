import { getLoader } from "../components/loader.js";

const buildLoadingView = () => {
    const contentContainer = document.querySelector('.content');
    contentContainer.id = 'loading';

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'We\'ll be with you shortly';
    loadingMessage.style.marginBottom = '20px';

    const loadingAnimation = getLoader();

    contentContainer.innerHTML = '';
    contentContainer.appendChild(loadingMessage);
    contentContainer.appendChild(loadingAnimation);
}

export { buildLoadingView };