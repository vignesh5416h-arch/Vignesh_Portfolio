
function notFound(req, res, next) {
  res.status(404).json({ message: "Resource not found." });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request is too large."
    });
  }

  console.error("Request error:", error.message);

  return res.status(500).json({
    message: "An unexpected server error occurred."
  });
}

module.exports = { notFound, errorHandler };
