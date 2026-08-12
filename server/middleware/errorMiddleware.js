function notFound(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

function errorHandler(error, request, response, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "An unexpected server error occurred.";
  let errors;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(error.errors).map((item) => item.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "value";
    message = `That ${field} is already in use.`;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${error.path || "identifier"}.`;
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "The authentication token is invalid.";
  }

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body contains invalid JSON.";
  }

  if (message === "Origin is not allowed by CORS.") {
    statusCode = 403;
  }

  const body = { success: false, message };
  if (errors) {
    body.errors = errors;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    body.stack = error.stack;
  }

  response.status(statusCode).json(body);
}

module.exports = { notFound, errorHandler };
