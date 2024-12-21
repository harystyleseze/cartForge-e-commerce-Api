const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeUtils = {
  async createPaymentIntent(amount, currency, metadata) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      metadata
    });
  },

  async retrievePaymentIntent(paymentIntentId) {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }
};

module.exports = stripeUtils;