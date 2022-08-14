import express from "express";

import { gameController } from "../features/game/index.js";

export const router = express.Router();

// Set up /game routes.
router.route("/new").get(gameController.generateGame);
router.route("/:id").get(gameController.getGame);
router.route("/:id/forfeit").post(gameController.forfeitGame);
