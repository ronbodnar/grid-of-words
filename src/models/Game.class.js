import { DEFAULT_MAX_ATTEMPTS } from "../constants.js";

/*
 * A representation of a Game.
 */
export class Game {
  id = undefined;
  word = undefined;
  state = undefined;
  startTime = undefined;
  endTime = undefined;
  timed = undefined;
  attempts = undefined;
  maxAttempts = undefined;

  constructor(maxAttempts = DEFAULT_MAX_ATTEMPTS, timed = false) {
    this.state = "STARTED";
    this.startTime = new Date();
    this.attempts = [];
    this.maxAttempts = maxAttempts;
    this.timed = timed;
    return this;
  }

  fromJson(json) {
    if (json === undefined) return null;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.timed = json.timed;
    this.startTime = new Date(json.start_timestamp);
    if (json.end_timestamp != null) this.endTime = new Date();
    if (json.attempts != null) this.attempts = json.attempts;
    return this;
  }
}
