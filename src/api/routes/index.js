import express from "express";

import { wordRoutes } from "../features/word/index.js";
import { gameRoutes } from "../features/game/index.js";
import { authRoutes } from "../features/auth/index.js";
import { restrict } from "../middleware/restrict.js";
import { userRepository } from "../features/user/index.js";

export const router = express.Router();

router.use("/word", restrict, wordRoutes);
router.use("/game", restrict, gameRoutes);
router.use("/auth", restrict, authRoutes.router);
router.route("/test").get(userRepository.findAll);
