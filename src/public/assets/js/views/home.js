/*
 *
 */
const buildHomeContainer = () => {
    const container = document.createElement('div');
    container.id = 'home-container';
    container.classList.add('content hidden');

    const header = document.createElement('h1');
    header.textContent = 'Word Game';

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const howToPlayButton = document.createElement('button');
    howToPlayButton.classList.add('button', 'fixed');
    howToPlayButton.type = 'button';
    howToPlayButton.setAttribute('disabled', 'true');
    howToPlayButton.addEventListener("click", () => {
      console.log("how to play clicked");
    });
    
    const startGameButton = document.createElement('button');
    startGameButton.classList.add('button', 'fixed');
    startGameButton.type = 'button';
    startGameButton.addEventListener("click", () => {
        console.log("start game clicked");
      });
}

export { buildHomeContainer };