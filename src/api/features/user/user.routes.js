import express from "express"
import { handleGetStatistics } from "./statistics/statistics.controller.js"

export const router = express.Router()

router.route("/:id/statistics").get(handleGetStatistics)
