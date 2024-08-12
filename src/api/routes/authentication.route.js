import express from "express";
import { loginUser, logoutUser, registerUser, changePassword, forgotPassword, resetPassword, validatePasswordResetToken } from "../controllers/authentication.controller.js";

export const router = express.Router();

// Set up /auth POST routes.
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/register").post(registerUser);
router.route("/validate").post(validatePasswordResetToken);

// These could be under /user routes but i'm not planning on going in depth into user account features.
router.route("/reset-password").post(resetPassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/change-password").post(changePassword);
