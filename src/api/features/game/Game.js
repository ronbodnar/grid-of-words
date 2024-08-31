import GameState from "./GameState.js"
import { updateGame } from "./game.repository.js"

/*
 * A representation of a Game.
 */
class Game {
  state = GameState.IN_PROGRESS
  word = undefined
  attempts = []
  maxAttempts = undefined
  startTimestamp = new Date()
  endTimestamp = undefined
  ownerId = undefined
  language = undefined

  /**
   * Constructs a new Game object from the given object's properties.
   *
   * @param {Object} obj - (optional) - An object with the following optional properties:
   * @param {ObjectId} [obj._id] The ObjectId object containing the game ID.
   * @param {string} [obj.word] The target word for winning the game.
   * @param {GameState} [obj.state=GameState.IN_PROGRESS] The state of the game.
   * @param {Array} [obj.attempts=[]] An array of attempts made in the game.
   * @param {string} [obj.startTimestamp] The timestamp for the start of the game.
   * @param {string} [obj.endTimestamp] The timestamp for the end of the game.
   * @param {string} [obj.maxAttempts=DEFAULT_MAX_ATTEMPTS] The maximum number of attempts before the game ends.
   * @param {string} [obj.ownerId] The ObjectID object for the authenticated owner of the game.
   */
  constructor(obj) {
    if (!obj) return

    // Only add the _id property if it was provided to us as to not insert the game with the ID.
    if (obj._id) this._id = obj._id

    this.word = obj.word || this.word
    this.state = obj.state || this.state
    this.maxAttempts = obj.maxAttempts || this.maxAttempts
    this.startTimestamp = obj.startTimestamp || this.startTimestamp
    this.endTime = obj.endTimestamp || this.endTimestamp
    this.attempts = obj.attempts || this.attempts
    this.ownerId = obj.ownerId || this.ownerId
    this.language = obj.language || this.language
  }

  /**
   * Asynchronously saves the game to the database and waits for the operation to complete.
   *
   * @async
   * @returns {Promise<any>} A promise that resolves to the saved game if successful.
   */
  async save() {
    return updateGame(this)
  }
}

export default Game
