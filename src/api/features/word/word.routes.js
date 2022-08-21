import express from "express";
import { wordController } from "./index.js";

export const router = express.Router();

// Set up /word routes.
router.route("/").get(wordController.getWord);
router.route("/list").get(wordController.getWordList);
