
const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const dataDirectory = path.resolve(
  process.env.DATA_DIR || path.join(__dirname, "../../data")
);

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, "portfolio.sqlite"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertMessage = db.prepare(`
  INSERT INTO contact_messages (name, email, subject, message)
  VALUES (@name, @email, @subject, @message)
`);

module.exports = { db, insertMessage };
