import logger from "../config/winston.config.js";
import { getByUsername } from "./user.service.js";

export const authenticate = async (user, pass) => {
  /*   const dbUser = await getByUsername(user);
  if (dbUser === undefined) {
    return false;
  } */

  if (user === "test" && pass === "test123") {
    return {
      username: user
    };
  } else {
    return undefined;
  }
};

export const generateSession = (req, res, authenticatedUser) => {
  req.session.regenerate(function (err) {
    if (err) {
      logger.error("Error regenerating session", {
        error: err,
        request: req,
      });
      return res.json({
        message: "Authentication failed: session regeneration",
      });
    }

    req.session.user = authenticatedUser;
    req.session.isLoggedIn = true;
    logger.info("Successful user login attempt", {
      user: authenticatedUser,
      request: req,
    });
    return res.json({
      message: "User logged in successfully.",
      user: authenticatedUser,
    });
  });
};
