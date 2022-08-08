import express from "express";
import { loginUser, logoutUser, registerUser, whoisUser } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Set up /auth routes.
router.route("/who").get(whoisUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/register").post(registerUser);
