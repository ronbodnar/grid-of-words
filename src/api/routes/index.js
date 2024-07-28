import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { __dirname } from "../constants.js";
import { getGameById } from "../repository/game.repository.js";
import { checkBearer } from "../middleware/bearer-auth.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", checkBearer, wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", checkBearer, gameRoutes, attemptRoutes);

// Serve any session data for the user in the initial GET request.
router.get("/session", checkBearer, async function (req, res) {
  let game = undefined;
  if (req.session.gameId) {
    game = await getGameById(req.session.gameId);
    if (!game) {
      res.end();
      return;
    }
    // Dont return session games that were ended/forfeited (they should be cleared, but check anyways).
    if (game?.state !== "STARTED") {
      res.end();
      return;
    }
  }

  // The session data to be returned.
  res.json({
    game: game,
  });
});