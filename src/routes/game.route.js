import express from "express";

import * as gameController from "../controllers/game.controller.js";
import * as attemptController from "../controllers/attempt.controller.js";

const router = express.Router();
router.route("/new").get(gameController.generate);
router.route("/:id").get(gameController.get);
router.route("/:id/attempts").get(attemptController.getAttempts);
router.route("/:id/attempts").post(attemptController.attempt);

export default router;
