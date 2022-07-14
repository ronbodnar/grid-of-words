import express from "express";

import { getGame, generateGame } from "../controllers/game.controller.js";

const router = express.Router();
router.route("/new").get(generateGame);
router.route("/:id").get(getGame);

export default router;
