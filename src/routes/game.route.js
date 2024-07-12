import express from "express";

import * as gameController from "../controllers/game.controller.js";

const router = express.Router();
router.route("/new").get(gameController.generate);
router.route("/:id").get(gameController.get);

export default router;
