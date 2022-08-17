/**
 * Builds the loading animation element.
 */
export const buildLoadingElement = () => {
    const loader = document.createElement('span');
    loader.classList.add('loader');

    return loader;
}