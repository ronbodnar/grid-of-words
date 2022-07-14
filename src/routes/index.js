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
  var game = undefined;
  if (req.session.gameId) {
    game = await getGameById(req.session.gameId);
    console.log(game);
  }
  res.render("pages/index", {
    title: "Wordle+",
    game: game,
  });
});

export default router;
