import express from "express";

import wordRoutes from "./word.route.js";
import gameRoutes from "./game.route.js";
import attemptRoutes from "./attempt.route.js";
import { __dirname } from "../constants.js";

const router = express.Router();

// Add the word routes to the router
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

// Serve any session data for the user in the initial GET request.
router.get("/session", async function (req, res) {
  let game = undefined;
  if (req.session.gameId) {
    game = await getGameById(req.session.gameId);
  }

  setTimeout(() => {
  res.json({
    game: game
  });
}, 2000);
});

export default router;
