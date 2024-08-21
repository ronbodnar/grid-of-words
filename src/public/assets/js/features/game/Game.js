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
   * @param {Object} [obj] - Optional JSON object to initialize the Game instance.
   * @param {string} obj._id - The unique identifier for the game.
   * @param {string} obj.word - The word to be guessed in the game.
   * @param {string} obj.state - The current state of the game.
   * @param {number} obj.maxAttempts - Maximum allowed attempts for the game.
   * @param {string} obj.startTimestamp - The timestamp when the game started (ISO format).
   * @param {string} [obj.endTimestamp] - The timestamp when the game ended (ISO format).
   * @param {Array<any>} [obj.attempts] - The array of attempts made by the player.
   */
  constructor(obj) {
    if (!obj) return;
    this._id = obj._id;
    this.word = obj.word;
    this.state = obj.state;
    this.maxAttempts = obj.maxAttempts;
    this.startTime = new Date(obj.startTimestamp);
    this.endTime = (obj.endTimestamp ? new Date() : undefined);

    /*
     * The attempts array needs to be made a deep copy instead of a reference.
     * This is because we update the attempts array during validation but the original values are needed.
     */
    this.attempts = (obj.attempts ? JSON.parse(JSON.stringify(obj.attempts)) : []);
  }
}
