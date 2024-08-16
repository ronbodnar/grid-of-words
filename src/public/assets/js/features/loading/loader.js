/**
 * Builds the loader element with the animation.
 */
export const buildLoaderElement = () => {
    const loader = document.createElement('span');
    loader.classList.add('loader');

    return loader;
}