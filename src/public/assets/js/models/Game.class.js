export class Game {
  id;
  word;
  attempts;
  maxAttempts;
  state;
  startTime;
  endTime;

  constructor(json) {
    //console.log("Received json: ", json);
    if (json === undefined) return this;
    this.id = json.id;
    this.word = json.word;
    this.state = json.state;
    this.maxAttempts = json.maxAttempts;
    this.startTime = new Date(json.startTimestamp);
    this.endTime = (json.endTimestamp ? new Date() : undefined);
    this.attempts = (json.attempts ? [...json.attempts] : []); // create a copy of the attempts array
    return this;
  }

  equals(a, b) {
    const aEntries = Object.entries(a);
    const bEntries = Object.entries(b);
    
    const filtered = Object.entries(this).filter((data) => {
      const key = data[0];
      const val = data[1];
      console.log(val, gameEntries[key]);
      if (typeof val === "undefined" && typeof gameEntries[key] === "undefined")
        return false;

      return gameEntries[key] === val;
    });
    return filtered.length === 0;
  }
}
