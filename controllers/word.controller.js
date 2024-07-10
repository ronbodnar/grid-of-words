import * as wordUtils from "../lib/word-utils.js"

function getWord(req, res) {
  return res.end(wordUtils.getWord(req, res));
}

export { getWord };