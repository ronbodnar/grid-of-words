import express from "express";

import { wordRoutes } from "../features/word/index.js";
import { gameRoutes } from "../features/game/index.js";
import { authRoutes, authController } from "../features/auth/index.js";
import { restrict } from "../middleware/restrict.js";
import { findAll } from "../features/user/user.repository.js";

export const router = express.Router();

router.use("/word", restrict, wordRoutes.router);
router.use("/game", restrict, gameRoutes.router);
router.use("/auth", restrict, authRoutes.router);
router.route("/session").get(authController.getSession);
router.route("/test").get(findAll);
