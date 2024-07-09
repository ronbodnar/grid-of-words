import app from "./config/express.config.js";

const hostname = "127.0.0.1";
const port = 3000;

// Start the express server
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});