import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_WORD_LENGTH,
  MAXIMUM_MAX_ATTEMPTS,
  MAXIMUM_WORD_LENGTH,
  MINIMUM_MAX_ATTEMPTS,
  MINIMUM_WORD_LENGTH,
} from "../../../shared/utils/constants.js"
import Option from "../models/Option.js"
import OPTION_TYPE from "./OptionType.js"

const OPTIONS = Object.freeze({
  // Sliders
  WORD_LENGTH: new Option("Word Length", OPTION_TYPE.SLIDER, {
    minValue: MINIMUM_WORD_LENGTH,
    maxValue: MAXIMUM_WORD_LENGTH,
    defaultValue: DEFAULT_WORD_LENGTH,
  }),
  MAX_ATTEMPTS: new Option("Max Attempts", OPTION_TYPE.SLIDER, {
    minValue: MINIMUM_MAX_ATTEMPTS,
    maxValue: MAXIMUM_MAX_ATTEMPTS,
    defaultValue: DEFAULT_MAX_ATTEMPTS,
  }),

  // Select / Dropdowns
  LANGUAGE: new Option("Language", OPTION_TYPE.SELECT, {
    optionList: ["English", "Spanish"],
    defaultValue: "english",
  }),
})

export default OPTIONS
