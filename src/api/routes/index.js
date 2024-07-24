import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { __dirname } from "../constants.js";
import { getGameById } from "../repository/game.repository.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

// Serve any session data for the user in the initial GET request.
router.get("/session", async function (req, res) {
  let game = undefined;
  if (req.session.gameId) {
    game = await getGameById(req.session.gameId);
    // Dont return session games that were ended/forfeited (they should be cleared, but check anyways).
    if (game?.state !== "STARTED") {
      return;
    }
  }

  // Timeout is for testing purposes with the loading screen.
  setTimeout(() => {
    res.json({
      game: game,
    });
  }, 500);
});