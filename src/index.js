import http from "node:http"
import app from "./api/config/express.config.js"
import logger from "./api/config/winston.config.js"
import db from "./api/shared/database.js"
import { APP_NAME } from "./api/shared/constants.js"

const { HOST, PORT, NODE_ENV } = process.env

const initialize = async () => {
  logger.info(`Initiializing ${APP_NAME} API Services...`)

  try {
    logger.info("Connecting to the database...")
    await db.connect()
  } catch (error) {
    logger.error("Error connecting to the database on launch", {
      error: error,
    })
    process.exit(1)
  }

  logger.info(`Setting up Express server...`)
  const server = createServer()
  startServer(server)
}

const createServer = () => {
  try {
    return http.createServer(app)
  } catch (error) {
    logger.error("Error creating HTTP server", {
      error: error,
    })
    process.exit(1)
  }
}

const startServer = (server) => {
  server.listen(PORT, () => {
    logger.info(`Server "${NODE_ENV}" running at http://${HOST}:${PORT}/`)
  })
}

await initialize()
