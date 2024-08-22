import { router as wordRoutes } from "../features/word/word.routes.js";
import { router as gameRoutes } from "../features/game/game.routes.js";
import { router as authRoutes } from "../features/auth/authentication.routes.js";
import { getSessionData } from "../features/session/session.controller.js";
import { findAll } from "../features/user/user.repository.js";
import { restrict } from "../middleware/restrict.js";

export const router = express.Router();

router.use("/word", restrict, wordRoutes);
router.use("/game", restrict, gameRoutes);
router.use("/auth", restrict, authRoutes);
router.use("/session", getSessionData);
router.route("/test").get(findAll);
