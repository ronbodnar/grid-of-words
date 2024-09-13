export const ENV = "production"
export const APP_NAME = "Word Puzzle Game"

// Max attempt declarations
export const DEFAULT_MAX_ATTEMPTS = 6
export const MINIMUM_MAX_ATTEMPTS = 3
export const MAXIMUM_MAX_ATTEMPTS = 8

// Word length declarations
export const DEFAULT_WORD_LENGTH = 5
export const MINIMUM_WORD_LENGTH = 4
export const MAXIMUM_WORD_LENGTH = 8

// Letter matching for keyboard/game board updates
export const EXACT_MATCH = 1
export const PARTIAL_MATCH = 2
export const NO_MATCH = 3

// Regular Expressions for validation
export const USERNAME_REGEX = /^[a-zA-Z0-9 _-]{3,16}$/
export const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const HIDE_MESSAGE_DELAY = 3000 // Delay in milliseconds
export const END_GAME_GRACE_PERIOD = 3500 // Delay in milliseconds
