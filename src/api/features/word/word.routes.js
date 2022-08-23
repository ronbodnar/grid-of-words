import express from "express";
import { wordController } from "./index.js";

const router = express.Router();

router.route("/").get(wordController.getRandomWord);
router.route("/list").get(wordController.getWordList);

export default router;
