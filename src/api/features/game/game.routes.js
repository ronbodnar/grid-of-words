import express from "express";

import { gameController } from "./index.js";

export const router = express.Router();

// Set up /game routes.
router.route("/new").get(gameController.generateNewGame);
router.route("/:id").get(gameController.getGameById);
router.route("/:id/abandon").post(gameController.abandonGameById);
router.route("/:id/attempt").post(gameController.addAttempt);
