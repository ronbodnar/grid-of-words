import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { router as routes } from "../routes/index.js";
import { __dirname } from "../shared/constants.js";
import logger from "./winston.config.js";
import errorHandler from "../middleware/error-handler.js";

export const app = express();

// Parse application/json content in the request body.
app.use(bodyParser.json());

// Parse cookies in the request body
app.use(cookieParser());

// Load the static assets from the assets folder
app.use(express.static(path.join(__dirname, "..", "..", "..", "public")));
 
// Limit requests to 1 per second.
/* app.use(
  rateLimit({
    windowMs: 1000,
    limit: 1,
    skip: (req, res) => req.cookies.apiKey
  })
); */

// Assign routes starting with the root path
app.use("/", routes);

// Handle errors in the application
app.use(errorHandler);

app.use("*", function (req, res) {
  logger.info(`Request received at: ${req.url}`);
});

export default app;