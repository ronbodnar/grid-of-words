import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import routes from "../routes/index.js";
import cookieSession from "cookie-session";

const app = express();

const __dirname = import.meta.dirname;

// Set up the cookie session middleware to maintain any in-progress games.
app.use(
  cookieSession({
    name: "session",
    keys: ["secret", "keys"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Parse application/json content
app.use(bodyParser.json());

// Load the static assets from the assets folder
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Set the view engine to use EJS
app.set("view engine", "ejs");

// Set the views directory relative to this file
app.set("views", path.join(__dirname, "..", "views"));

// Assign routes starting with the root path
app.use("/", routes);

export default app;
