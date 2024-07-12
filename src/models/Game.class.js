import { DEFAULT_MAX_ATTEMPTS } from '../constants.js';

/*
 * A representation of a Game.
 */
export class Game {

    uuid = undefined;
    word = undefined;
    state = undefined;
    startTime = undefined;
    endTime = undefined;
    attempts = undefined;
    maxAttempts = undefined;

    constructor(maxAttempts = DEFAULT_MAX_ATTEMPTS) {
        this.state = 'STARTED';
        this.startTime = new Date();
        this.attempts = [];
        this.maxAttempts = maxAttempts;
        return this;
    }

    fromJson(json) {
        this.uuid = json.id;
        this.word = json.word;
        this.state = json.state;
        this.startTime = new Date(json.start_timestamp);
        if (json.end_timestamp != null)
            this.endTime = new Date();
        if (json.attempts != null)
            this.attempts = json.attempts;
        return this;
    }

}