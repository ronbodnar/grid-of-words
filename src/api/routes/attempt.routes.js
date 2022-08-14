import express from "express";
import { attemptController } from "../features/attempt/index.js";

export const router = express.Router();

// Set up /attempt routes.
router.route("/:id/attempts").get(attemptController.getAttempts);
router.route("/:id/attempts").post(attemptController.addAttempt);
