import express from "express";
import {
  handleAbandonGameById,
  handleAddAttempt,
  handleGenerateNewGame,
  handleGetGameById,
} from "./game.controller.js";

export const router = express.Router();

router.route("/new").get(handleGenerateNewGame);
router.route("/:id").get(handleGetGameById);
router.route("/:id/abandon").post(handleAbandonGameById);
router.route("/:id/attempt").post(handleAddAttempt);
