import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import { app } from "./api/config/express.config.js";
import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
let server;

// Set up the HTTP/HTTPS server based on the NODE_ENV variable
if (process.env.NODE_ENV === "production") {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CERT_FILE),
  };

  server = https.createServer(options, app);
} else if (process.env.NODE_ENV === "development") {
  server = http.createServer(app);
}

// Start the express server
server.listen(port, () => {
  logger.info(`Server "${process.env.NODE_ENV}" running at http://${hostname}:${port}/`);
});
