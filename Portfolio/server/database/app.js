
const path = require("node:path");
const express = require("express");
const helmet = require("helmet");

const contactRoutes = require("./routes/contactRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const publicDirectory = path.resolve(__dirname, "../public");

app.disable("x-powered-by");

app.use(helmet());

app.use(express.json({ limit: "10kb", strict: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/contact", contactRoutes);

app.use(express.static(publicDirectory, {
  index: "index.html",
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
