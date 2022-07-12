import { v4 as uuidv4 } from 'uuid';

/*
 * A representation of a Game.
 */
class Game {

    #uuid = undefined;
    #word = undefined;
    #owner = undefined;
    #state = undefined;
    #startTime = undefined;
    #endTime = undefined;
    #attempts = undefined;

    constructor(word, owner) {
        this.#word = word;
        this.#owner = owner;
        this.#uuid = uuidv4();
        this.#state = 'IN_PROGRESS';
        this.#startTime = new Date();
        this.#attempts = new Set();
        console.log('Starting a new game...');
    }
}