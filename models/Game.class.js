class Game {

    word = undefined;
    wordLength = undefined;

    state = undefined; // IN_PROGRESS, FORFEIT, WIN, MISS

    owner = undefined;

    startTime = undefined;
    endTime = undefined;

    timed = undefined;

    maxGuesses = undefined;
    guessedWords = undefined;

    constructor() {
        state = 'IN_PROGRESS';
        startTime = new Date();
        guessedWords = new Set();
        console.log('Starting a new game...');
    }
}