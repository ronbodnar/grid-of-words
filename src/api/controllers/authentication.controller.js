import logger from "../config/winston.config.js";
import { authenticate } from "../services/authentication.service.js";

export const loginUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.json({
            status: "error",
            error: "Username and password are required."
        });
    }

    const validAuth = authenticate(username, password);

    logger.info("Login request received", {
        username: username,
        password: password,
        valid: validAuth,
    });
}

export const logoutUser = (req, res) => {
}

export const registerUser = (req, res) => {
}