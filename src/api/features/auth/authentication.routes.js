import express from "express";
import { handleLoginUser } from "./login/login.controller.js";
import { handleLogoutUser } from "./logout/logout.controller.js";
import { handleRegisterUser } from "./register/register.controller.js";
import { handleValidatePasswordResetToken } from "./validate-token/validate-token.controller.js";
import { handleResetPassword } from "./reset-password/reset-password.controller.js";
import { handleForgotPassword } from "./forgot-password/forgot-password.controller.js";
import { handleChangePassword } from "./change-password/change-password.controller.js";

export const router = express.Router();

router.route("/login").post(handleLoginUser);
router.route("/logout").post(handleLogoutUser);
router.route("/register").post(handleRegisterUser);
router.route("/validate-token").post(handleValidatePasswordResetToken);

// These could be under /user routes but I'm not planning on going in depth into user account features in this project.
router.route("/reset-password").post(handleResetPassword);
router.route("/forgot-password").post(handleForgotPassword);
router.route("/change-password").post(handleChangePassword);
