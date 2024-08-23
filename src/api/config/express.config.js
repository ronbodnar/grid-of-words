import path from "node:path";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { router as routes } from "../routes/index.js";
import { __dirname } from "../shared/constants.js";
import logger from "./winston.config.js";
import errorHandler from "../middleware/error-handler.js";

export const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "..", "public")));

// Set up the rate limit middleware for 200 requests per 15 minutes.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    message: JSON.stringify({ error: "Too many requests, please try again later." }),
    //skip: (req) => req.cookies.apiKey
  })
);

app.use("*", function (req, res, next) {
  logger.info(`Incoming request from ${req.socket.localAddress}: ${req.url}`);
  next();
});

app.use("/", routes);

app.use(errorHandler);

export default app;