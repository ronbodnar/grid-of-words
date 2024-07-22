import express from "express";

import { getGame, generateGame, forfeitGame, } from "../controllers/game.controller.js";

export const router = express.Router();

// Set up /game routes.
router.route("/new").get(generateGame);
router.route("/:id").get(getGame);
router.route("/:id/forfeit").post(forfeitGame);
