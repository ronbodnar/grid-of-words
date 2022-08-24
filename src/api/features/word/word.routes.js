import express from "express";
import { wordController } from "./index.js";

export const router = express.Router();

router.route("/").get(wordController.getRandomWord);
router.route("/list").get(wordController.getWordList);
