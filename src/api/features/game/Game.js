import { DEFAULT_MAX_ATTEMPTS } from "../../utils/constants.js";
import { saveGame } from "./game.repository.js";

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
  ownerId = undefined;

  constructor(maxAttempts = DEFAULT_MAX_ATTEMPTS) {
    this.state = "STARTED";
    this.startTime = new Date();
    this.attempts = [];
    this.maxAttempts = maxAttempts;
    return this;
  }

  fromJson(json) {
    if (json === undefined) return this;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.maxAttempts = json.maxAttempts;
    this.startTime = new Date(json.startTimestamp);
    if (json.endTimestamp != null) this.endTime = new Date();
    if (json.attempts != null) this.attempts = json.attempts;
    this.ownerId = json.ownerId;
    return this;
  }

  save() {
    return saveGame(this);
  }
}
