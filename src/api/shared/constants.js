export const APP_NAME = "Word Puzzle Game";

// Max attempt declarations
export const DEFAULT_MAX_ATTEMPTS = 6;
export const MINIMUM_MAX_ATTEMPTS = 3;
export const MAXIMUM_MAX_ATTEMPTS = 8;

// Word length declarations
export const DEFAULT_WORD_LENGTH = 5;
export const MINIMUM_WORD_LENGTH = 4;
export const MAXIMUM_WORD_LENGTH = 8;

// Regular Expressions for validation
export const USERNAME_REGEX = /^[a-zA-Z0-9 _-]{3,16}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// The absolute path of the current file being executed.
export const __dirname = import.meta.dirname;