var attemptLetters = [];

const start = async () => {
    console.log('Starting game...');
    var params = new URLSearchParams({
        timed: false,
        wordLength: 5,
        maxAttempts: 6,
        render: true
    });
    try {
        var response = await fetch(`/game/new?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        console.log(json);

        var homeContainer = document.querySelector('#home-container');
        console.log(homeContainer);
        if (homeContainer) {
            homeContainer.classList.add('hidden');
        }

        var gameContainer = document.querySelector('#game-container');
        console.log(gameContainer);
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
    }
}

const attempt = () => {

}