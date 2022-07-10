import path from "node:path";
import express from "express";
import * as word from "./controllers/word.js";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const __dirname = import.meta.dirname;

// Load the static assets from the assets folder
app.set(express.static(path.join(__dirname, "assets")));

// Set the view engine to use EJS
app.set('view engine', 'ejs');

// Set the views parent directory
app.set('views', path.join(__dirname, "views"));

// Listen for get requests to the root
app.get("/", (req, res) => {
  res.render("index");
});

// Set up controller endpoints
app.get("/word", word.readWords);

// Start the express server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});