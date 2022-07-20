import app from "./api/config/express.config.js";
import http from "node:http";
import https from "node:https";
import fs from "node:fs";

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
let server;

if (process.env.NODE_ENV === "production") {
  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/ronbodnar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/ronbodnar.com/fullchain.pem"),
  };

  server = https.createServer(options, app);
} else if (process.env.NODE_ENV === "development") {
  server = http.createServer(app);
}

console.log("Server Environment: ", process.env.NODE_ENV);

// Start the express server
server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
