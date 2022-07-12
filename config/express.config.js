import path from "node:path";
import express from "express";
import routes from "../routes/index.js";

const app = express();

const __dirname = import.meta.dirname;

// Load the static assets from the assets folder
app.use('/assets', express.static(path.join(__dirname, "..", "assets")));

// Set the view engine to use EJS
app.set('view engine', 'ejs');

// Set the views parent directory
app.set('views', path.join(__dirname, "..", "views"));

// Assign routes
app.use('/', routes);

export default app;