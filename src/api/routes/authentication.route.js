import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Set up /auth routes.
router.route("/login").get(loginUser);
router.route("/logout").get(logoutUser);
router.route("/register").get(registerUser);
