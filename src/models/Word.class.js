/*
 * A representation of a word.
 */
export class Word {
  uuid = undefined;
  text = undefined;

  constructor(uuid, word) {
    this.uuid = uuid;
    this.text = word;
  }
}
