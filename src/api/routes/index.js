import express from "express";

import { router as wordRoutes } from "./word.routes.js";
import { router as gameRoutes } from "./game.routes.js";
import { router as attemptRoutes } from "./attempt.routes.js";
import { router as authenticationRoutes } from "./authentication.routes.js";
import { __dirname } from "../utils/constants.js";
import { restrict } from "../middleware/restrict.js";
import { getSession } from "../features/auth/authentication.controller.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", restrict, wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", restrict, gameRoutes, attemptRoutes);

// Add the authentication routes to the router.
router.use("/auth", restrict, authenticationRoutes);

// Set up /auth GET routes.
router.route("/session").get(getSession);
