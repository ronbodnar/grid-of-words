import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { router as authenticationRoutes } from "./authentication.route.js";
import { __dirname } from "../constants.js";
import { setTokenCookie, verifyToken } from "../services/authentication.service.js";
import logger from "../config/winston.config.js";
import { requireToken } from "../middleware/require-token.js";
export const router = express.Router();

// Add the word routes to the router.
router.use("/word", requireToken, wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", requireToken, gameRoutes, attemptRoutes);

// Add the authentication routes to the router.
router.use("/auth", authenticationRoutes);