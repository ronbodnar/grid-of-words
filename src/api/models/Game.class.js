import { DEFAULT_MAX_ATTEMPTS } from "../constants.js";
import { saveGame } from "../repository/game.repository.js";

/*
 * A representation of a Game.
 */
export class Game {
  id = undefined;
  word = undefined;
  state = undefined;
  startTime = undefined;
  endTime = undefined;
  attempts = undefined;
  maxAttempts = undefined;

  constructor(maxAttempts = DEFAULT_MAX_ATTEMPTS) {
    this.state = "STARTED";
    this.startTime = new Date();
    this.attempts = [];
    this.maxAttempts = maxAttempts;
    return this;
  }

  fromJson(json) {
    console.log(json);
    if (json === undefined) return this;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.maxAttempts = json.max_attempts;
    this.startTime = new Date(json.start_timestamp);
    if (json.end_timestamp != null) this.endTime = new Date();
    if (json.attempts != null) this.attempts = json.attempts;
    return this;
  }

  save() {
    saveGame(this);
  }
}
