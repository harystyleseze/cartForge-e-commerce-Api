const dummyStripeService = {
  refunds: {
    async create({ payment_intent, amount, reason }) {
      // Simulate Stripe API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate dummy refund data
      const refundId = `re_dummy_${Date.now()}`;
      
      return {
        id: refundId,
        payment_intent,
        amount,
        status: 'succeeded',
        reason,
        created: Date.now(),
        currency: 'usd'
      };
    }
  }
};

module.exports = dummyStripeService; 