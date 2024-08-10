import express from "express";
import { loginUser, logoutUser, registerUser, getSession, changePassword, forgotPassword } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Set up /auth routes.
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/session").get(getSession);
router.route("/register").post(registerUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/change-password").post(changePassword);
