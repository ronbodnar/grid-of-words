import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { router as authenticationRoutes } from "./authentication.route.js";
import { __dirname } from "../constants.js";
import { getGameById } from "../repository/game.repository.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

// Add the authentication routes to the router.
router.use("/auth", authenticationRoutes)

// Serve any session data for the user in the initial GET request.
router.get("/session", async function (req, res) {
  let game = undefined;
  if (req.cookies.gameId) {
    game = await getGameById(req.cookies.gameId);
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