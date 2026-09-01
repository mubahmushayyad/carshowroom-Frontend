// Sends every error through the same { success, message, data, errors } shape
// so the frontend's Axios/Redux error handling stays consistent.
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';
  let errors = [];

  // Sequelize unique constraint (e.g. duplicate email) -> 409 Conflict
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors?.[0]?.message || 'This email is already registered';
  }

  // Sequelize model validation errors -> 400 Bad Request
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    message = 'Validation failed';
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
