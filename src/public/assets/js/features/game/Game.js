/**
 * Class representing a Game.
 */
export class Game {
  _id;
  word;
  attempts;
  maxAttempts;
  state;
  startTime;
  endTime;

  /**
   * Creates an instance of the Game class.
   * @param {Object} [json] - Optional JSON object to initialize the Game instance.
   * @param {string} json._id - The unique identifier for the game.
   * @param {string} json.word - The word to be guessed in the game.
   * @param {string} json.state - The current state of the game.
   * @param {number} json.maxAttempts - Maximum allowed attempts for the game.
   * @param {string} json.startTimestamp - The timestamp when the game started (ISO format).
   * @param {string} [json.endTimestamp] - The timestamp when the game ended (ISO format).
   * @param {Array<any>} [json.attempts] - The array of attempts made by the player.
   */
  constructor(json) {
    if (json === undefined) return this;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.maxAttempts = json.maxAttempts;
    this.startTime = new Date(json.startTimestamp);
    this.endTime = (json.endTimestamp ? new Date() : undefined);

    /*
     * The attempts array needs to be made a deep copy instead of a reference.
     * This is because we update the attempts array during validation but the original values are needed.
     */
    this.attempts = (json.attempts ? JSON.parse(JSON.stringify(json.attempts)) : []);
    return this;
  }
}
