
require("dotenv").config();

const app = require("./app");

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "127.0.0.1";

const server = app.listen(port, host, () => {
  console.log(`Portfolio server running at http://${host}:${port}`);
});

function shutdown() {
  server.close(() => {
    const { db } = require("./database/db");
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
