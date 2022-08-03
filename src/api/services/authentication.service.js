import { getByUsername } from "./user.service.js";

export const authenticate = (user, pass) => {
    const dbUser = getByUsername(user);
    if (dbUser === undefined) {
        return false;
    }

    

  if (validAuth) {
    req.session.regenerate(function (err) {
      if (err) {
        logger.error("Error regenerating session", {
          error: err,
          request: req,
        });
        return res.json({
          error: "Authentication failed: session regeneration",
        });
      }

      req.session.user = username;
      req.session.isLoggedIn = true;
      logger.info("Successful user login attempt", {
        user: username,
        request: req,
      });
      res.json({
        message: "User logged in successfully.",
        user: username,
      })
    });
  } else {
    res.status(401).json({
      message: "Invalid username or password.",
    });
  }
  
    console.log("dbUser", dbUser);
    return user === "test" && pass === "test123";
}