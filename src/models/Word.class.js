/*
 * A representation of a word.
 */
export class Word {

    #uuid = undefined;
    #word = undefined;

    constructor(uuid, word) {
        this.#uuid = uuid;
        this.#word = word;
    }
    
    get uuid() {
        return this.#uuid;
    }

    get word() {
        return this.#word;
    }
}