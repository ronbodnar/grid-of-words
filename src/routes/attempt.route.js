import express from "express";

import { addAttempt, getAttempts } from "../controllers/attempt.controller.js";

const router = express.Router();
router.route("/:id/attempts").get(getAttempts);
router.route("/:id/attempts").post(addAttempt);

export default router;
