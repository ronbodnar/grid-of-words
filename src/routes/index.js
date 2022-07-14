import express from "express";

import wordRoutes from "./word.route.js";
import gameRoutes from "./game.route.js";
import attemptRoutes from "./attempt.route.js";
import { getGameById } from "../repository/game.repository.js";

const router = express.Router();

// Add the word routes to the router
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);


// Default route entry point
router.get("/", async function (req, res) {
  if (req.session.gameId) {
    const game = await getGameById(req.session.gameId);
    console.log(game);
    res.render("pages/game");
    return;
  }
  res.render("pages/index");
});

export default router;
