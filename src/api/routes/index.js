import express from "express";
import { router as wordRoutes } from "../features/word/word.routes.js";
import { router as gameRoutes } from "../features/game/game.routes.js";
import { router as authRoutes } from "../features/auth/authentication.routes.js";
import { handleGetSessionData } from "../features/session/session.controller.js";
import { findAllUsers } from "../features/user/user.repository.js";
import { restrict } from "../middleware/restrict.js";

export const router = express.Router();

router.use("/word", restrict, wordRoutes);
router.use("/game", restrict, gameRoutes);
router.use("/auth", restrict, authRoutes);
router.route("/session").get(handleGetSessionData);
router.route("/test").get(findAllUsers);
