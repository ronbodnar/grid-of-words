import express from "express";

import { getWord } from "../controllers/word.controller.js";

const router = express.Router();

router.route("/").get(getWord);

export default router;
