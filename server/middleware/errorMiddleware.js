// ============================================================================
// The Indian Rasoi — Centralized Error Handling Middleware
// Formats validation, authentication, and database connection errors.
// Prevents exposing raw Mongoose buffering timeouts or stack traces.
// ============================================================================

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose disconnected query buffering timeout or connection errors
  if (
    (err.name === 'MongooseError' && err.message && err.message.includes('buffering timed out')) ||
    (err.message && err.message.includes('buffering timed out')) ||
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.code === 'ECONNREFUSED'
  ) {
    statusCode = 503;
    message = 'Unable to connect to the server. Please try again later.';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the specified ID.';
  }

  // Mongoose duplicate key (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `An account with this ${field} already exists.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(statusCode === 503 ? { code: 'DATABASE_UNAVAILABLE' } : {}),
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
