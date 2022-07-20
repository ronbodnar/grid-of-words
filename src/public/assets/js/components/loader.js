const getLoader = () => {
    const loader = document.createElement('span');
    loader.classList.add('loader');

    return loader;
}

export { getLoader };