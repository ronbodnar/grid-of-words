import express from "express";

import { authController } from "./index.js";

export const router = express.Router();

// Set up /auth POST routes.
router.route("/login").post(authController.loginUser);
router.route("/logout").post(authController.logoutUser);
router.route("/register").post(authController.registerUser);
router.route("/validate").post(authController.validatePasswordResetToken);

// These could be under /user routes but i'm not planning on going in depth into user account features.
router.route("/reset-password").post(authController.resetPassword);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/change-password").post(authController.changePassword);
