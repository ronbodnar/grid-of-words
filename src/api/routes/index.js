import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { router as authenticationRoutes } from "./authentication.route.js";
import { __dirname } from "../constants.js";
import { restrict } from "../middleware/restrict.js";
import { getSession } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", restrict, wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", restrict, gameRoutes, attemptRoutes);

// Add the authentication routes to the router.
router.use("/auth", restrict, authenticationRoutes);

// Set up /auth GET routes.
router.route("/session").get(getSession);
