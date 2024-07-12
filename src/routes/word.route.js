import express from "express";

import * as wordController from "../controllers/word.controller.js";

const router = express.Router();

router.route("/").get(wordController.getRandomWord);

export default router;
