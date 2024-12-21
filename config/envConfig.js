require('dotenv').config();

module.exports = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'usd'
  },
  // ... other config options ...
};