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
}
