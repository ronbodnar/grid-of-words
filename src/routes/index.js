import express from "express";

import wordRoutes from "./word.route.js";
import gameRoutes from "./game.route.js";
import attemptRoutes from "./attempt.route.js";

const router = express.Router();
router.get("/", function (req, res) {
  res.render("index");
});

// Add the word routes to the router
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

export default router;
