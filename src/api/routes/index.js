import fs from "node:fs";
import path from "node:path";
import express from "express";

import wordRoutes from "./word.route.js";
import gameRoutes from "./game.route.js";
import attemptRoutes from "./attempt.route.js";
import { getGameById } from "../repository/game.repository.js";
import { __dirname } from "../constants.js";

const router = express.Router();

// Add the word routes to the router
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

// Default route entry point
router.use("/", async function (req, res) {
  let game = undefined;
  if (req.session.gameId) {
    game = await getGameById(req.session.gameId);
  }
  console.log(game);

  let data = {
    suffixes: ["st", "nd", "rd"]
  };

  if (game !== undefined)
    data.game = game;

  let htmlContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'));
  htmlContent = htmlContent.toString().replace('INITIAL_SCRIPT', `<script id="initial-data">${JSON.stringify(data)}</script>`);

  res.send({
    test: 'hey'
  });
});

export default router;
