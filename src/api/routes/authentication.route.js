import express from "express";
import { loginUser, logoutUser, whoisUser, registerUser } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Set up /auth routes.
router.route("/who").post(whoisUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/register").post(registerUser);
