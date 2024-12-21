const { errorMiddleware: stripeErrorMiddleware } = require('./stripeErrorHandler');

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = { 
  errorMiddleware: stripeErrorMiddleware, 
  globalErrorHandler 
};