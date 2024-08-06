import express from "express";

import { router as wordRoutes } from "./word.route.js";
import { router as gameRoutes } from "./game.route.js";
import { router as attemptRoutes } from "./attempt.route.js";
import { router as authenticationRoutes } from "./authentication.route.js";
import { __dirname } from "../constants.js";
import { verifyToken } from "../services/authentication.service.js";

export const router = express.Router();

// Add the word routes to the router.
router.use("/word", wordRoutes);

// Add the game and attempt/guess routes to the router.
router.use("/game", gameRoutes, attemptRoutes);

// Add the authentication routes to the router.
router.use("/auth", authenticationRoutes);

// Serve any session data for the user in the initial GET request.
router.get("/session", async function (req, res) {
  // Just in case the cookies can't be found, end the response.
  if (!req?.cookies) {
    res.end();
    return;
  }

  const payload = verifyToken(req.cookies.token);

  const user = {
    id: payload?.id,
    username: payload?.username,
  };

  // The session data to be returned.
  res.json({
    user: !payload ? undefined : user,
  });
});
