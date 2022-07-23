import express from "express";

import { getGame, generateGame, forfeitGame, } from "../controllers/game.controller.js";

const router = express.Router();
router.route("/new").get(generateGame);
router.route("/:id").get(getGame);
router.route("/:id/forfeit").post(forfeitGame);

export default router;
