export class Game {
  id;
  word;
  attempts = [];
  maxAttempts;
  state;
  startTime;
  endTime;

  constructor(json) {
    console.log("Received json: ", json);
    if (json === undefined) return this;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.maxAttempts = json.maxAttempts;
    this.startTime = new Date(json.startTimestamp);
    if (json.endTimestamp != null) this.endTime = new Date();
    if (json.attempts != null) this.attempts = json.attempts;
    return this;
  }

  equals(game) {
    const gameEntries = Object.entries(game);
    const filtered = Object.entries(this).filter((data) => {
      const key = data[0];
      const val = data[1];
      if (typeof val === "undefined" && typeof gameEntries[key] === "undefined")
        return false;
      return gameEntries[key] === val;
    });
    return filtered.length === 0;
  }
}
