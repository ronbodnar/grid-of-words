import express from "express"
import { router as wordRoutes } from "../features/word/word.routes.js"
import { router as gameRoutes } from "../features/game/game.routes.js"
import { router as authRoutes } from "../features/auth/authentication.routes.js"
import { router as userRoutes } from "../features/user/user.routes.js"
import { router as sessionRoutes } from "../features/session/session.routes.js"
import { restrict } from "../middleware/restrict.js"

export const router = express.Router()

router.use("/word", restrict, wordRoutes)
router.use("/game", restrict, gameRoutes)
router.use("/auth", restrict, authRoutes)
router.use("/users", restrict, userRoutes)
router.use("/session", sessionRoutes)
