import express from "express";
import { loginController } from "./login/index.js";
import { logoutController } from "./logout/index.js";
import { registerController } from "./register/index.js";
import { changePasswordController } from "./change-password/index.js";
import { forgotPasswordController } from "./forgot-password/index.js";
import { resetPasswordController } from "./reset-password/index.js";
import { validateTokenController } from "./validate-token/index.js";

export const router = express.Router();

router.route("/login").post(loginController.login);
router.route("/logout").post(logoutController.logout);
router.route("/register").post(registerController.register);
router
  .route("/validate-token")
  .post(validateTokenController.validatePasswordResetToken);

// These could be under /user routes but I'm not planning on going in depth into user account features in this project.
router.route("/reset-password").post(resetPasswordController.resetPassword);
router.route("/forgot-password").post(forgotPasswordController.forgotPassword);
router.route("/change-password").post(changePasswordController.changePassword);