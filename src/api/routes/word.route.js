import express from "express";

import { getWord, getWordList } from "../controllers/word.controller.js";

export const router = express.Router();

// Set up /word routes.
router.route("/").get(getWord);
router.route("/list").get(getWordList);
