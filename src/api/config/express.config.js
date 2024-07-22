import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import { router as routes } from "../routes/index.js";
import cookieSession from "cookie-session";
import { __dirname } from "../constants.js";

export const app = express();

// Set up the cookie session middleware.
app.use(
  cookieSession({
    name: "session",
    secret: "cookie secret",
    maxAge: 50000//24 * 60 * 60 * 1000, // 24 hours
  })
);

// Parse application/json content
app.use(bodyParser.json());

// Load the static assets from the assets folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Assign routes starting with the root path
app.use("/", routes);

app.use("*", function(req, res, next) {
  // TODO: 404
  console.log("Request received at:", req.url);
  res.end();
});
