import express from "express";

import * as attemptController from "../controllers/attempt.controller.js";

const router = express.Router();
router.route("/:id/attempts").get(attemptController.getAttempts);
router.route("/:id/attempts").post(attemptController.attempt);

export default router;
