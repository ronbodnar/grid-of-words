import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import app from "./api/config/express.config.js";
import logger from "./api/config/winston.config.js";
import db from "./api/shared/database.js";
import { APP_NAME } from "./api/shared/constants.js";

const { HOST, PORT, NODE_ENV, SSL_CERT_FILE, SSL_KEY_FILE } = process.env;
const productionMode = NODE_ENV === "production";

/**
 * Initialize required components for the application, such as the database and express server.
 */
const initialize = async () => {
  logger.info(`Initiializing ${APP_NAME} API Services...`);

  // Ensure we can connect to the datbase before proceeding.
  try {
    logger.info("Connecting to the database...");
    await db.connect();
    logger.info("Connected to the database successfully.");
  } catch (error) {
    logger.error("Error connecting to the database on launch", {
      error: error,
    });
    process.exit(1);
  }

  logger.info(`Setting up Express ${productionMode ? "HTTPS" : "HTTP"} server...`);
  const server =
    productionMode
      ? createProductionServer()
      : createDevelopmentServer();
  startServer(server);
};

/**
 * Creates an Express http server instance.
 * 
 * @returns {Server} The Express server instance.
 */
const createDevelopmentServer = () => {
  try {
    return http.createServer(app);
  } catch (error) {
    logger.error("Error creating HTTP server", {
      error: error,
    });
    process.exit(1);
  }
};

/**
 * Creates an Express https server instance using an SSL cert stored as a pem file.
 * 
 * @returns {Server} The Express server instance.
 */
const createProductionServer = () => {
  try {
    const options = {
      key: fs.readFileSync(SSL_KEY_FILE),
      cert: fs.readFileSync(SSL_CERT_FILE),
    };
    return https.createServer(options, app);
  } catch (error) {
    logger.error("Error creating HTTPS server with SSL certificate", {
      error: error,
    });
    process.exit(1);
  }
};

/**
 * Starts the Express HTTP/HTTPS server by listening to the PORT environment variable.
 * 
 * @param {Server} server The server instance to listen on.
 */
const startServer = (server) => {
  server.listen(PORT, () => {
    logger.info(`Server "${NODE_ENV}" running at http://${HOST}:${PORT}/`);
  });
};

/*
 * One line to rule them all.
 */
await initialize();