import express from "express";

import { gameController } from "./index.js";

const router = express.Router();

// Set up /game routes.
router.route("/new").get(gameController.generateNewGame);
router.route("/:id").get(gameController.getGameById);
router.route("/:id/forfeit").post(gameController.forfeitGameById);
router.route("/:id/attempt").post(gameController.addAttempt);

export default router;
