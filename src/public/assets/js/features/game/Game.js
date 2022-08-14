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

    /*
     * The attempts array needs to be made a deep copy instead of a reference.
     * This is because we update the attempts array during validation but the original values are needed.
     */
    this.attempts = (json.attempts ? JSON.parse(JSON.stringify(json.attempts)) : []);
    return this;
  }
}
