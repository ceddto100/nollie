const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let errors = [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    Object.keys(err.errors).forEach(key => {
      errors.push({ field: key, message: err.errors[key].message });
    });
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate Field Value';
    const field = Object.keys(err.keyValue)[0];
    errors.push({ field, message: `${field} already exists with value: ${err.keyValue[field]}` });
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID Format';
    errors.push({ field: err.path, message: `Invalid ${err.kind}` });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
