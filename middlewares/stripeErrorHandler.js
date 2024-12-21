const stripeErrorHandler = (err, req, res, next) => {
    if (err.type && err.type.startsWith('Stripe')) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
        type: err.type
      });
    }
    next(err);
  };
  
  module.exports = { errorMiddleware: stripeErrorHandler };