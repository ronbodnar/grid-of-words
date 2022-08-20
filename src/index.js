import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import app from "./api/config/express.config.js";
import logger from "./api/config/winston.config.js";

const host = process.env.HOST;
const port = process.env.PORT;
let server;

// Set up the HTTP/HTTPS server based on the NODE_ENV variable
if (process.env.NODE_ENV === "production") {
  let key;
  try {
    key = fs.readFileSync(process.env.SSL_KEY_FILE);
  } catch (err) {
    logger.error("Error reading SSL key file:", err);
    key = undefined;
  }

  let cert;
  try {
    cert = fs.readFileSync(process.env.SSL_CERT_FILE);
  } catch (err) {
    logger.error("Error reading SSL certificate file:", err);
    cert = undefined;
  }
  const options = {
    key: key,
    cert: cert,
  };

  server = https.createServer(options, app);
} else if (process.env.NODE_ENV === "development") {
  server = http.createServer(app);
}

// Start the express server
server.listen(port, () => {
  logger.info(
    `Server "${process.env.NODE_ENV}" running at http://${host}:${port}/`
  );
});
