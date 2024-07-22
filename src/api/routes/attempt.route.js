import express from "express";

import { addAttempt, getAttempts } from "../controllers/attempt.controller.js";

export const router = express.Router();

// Set up /attempt routes.
router.route("/:id/attempts").get(getAttempts);
router.route("/:id/attempts").post(addAttempt);
