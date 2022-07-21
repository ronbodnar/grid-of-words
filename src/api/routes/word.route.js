import express from "express";

import { getWord, getWordList } from "../controllers/word.controller.js";

const router = express.Router();

router.route("/").get(getWord);
router.route("/list").get(getWordList);

export default router;
