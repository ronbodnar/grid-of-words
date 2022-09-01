import express from "express"
import { handleGetGameById } from "./game.controller.js"
import { handleGenerateNewGame } from "./generate/generate.controller.js"
import { handleAbandonGameById } from "./abandon/abandon.controller.js"
import { handleAddAttempt } from "./attempt/attempt.controller.js"

export const router = express.Router()

router.route("/new").get(handleGenerateNewGame)
router.route("/:id").get(handleGetGameById)
router.route("/:id/abandon").post(handleAbandonGameById)
router.route("/:id/attempt").post(handleAddAttempt)
