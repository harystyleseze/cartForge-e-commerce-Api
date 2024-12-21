
/*
----
in .env file
NODE_ENV=development
MOCK_EXCHANGE_RATES=true

-----------
This will allow you to:
Test the order creation without an Exchange Rate API key
2. Use mock exchange rates for development
Gracefully handle API failures
Provide meaningful error messages


const axios = require('axios');

class CurrencyService {
  constructor() {
    this.exchangeRates = {};
    this.lastUpdate = null;
    this.UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  }

  async updateExchangeRates() {
    try {
      // Check if API key is configured
      if (!process.env.EXCHANGE_RATE_API_KEY) {
        console.warn('Exchange Rate API key not configured. Using default rate of 1.0');
        this.exchangeRates = { USD: 1, EUR: 1, GBP: 1 }; // Add default rates
        this.lastUpdate = Date.now();
        return;
      }

      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
      );

      if (response.data && response.data.conversion_rates) {
        this.exchangeRates = response.data.conversion_rates;
        this.lastUpdate = Date.now();
      } else {
        throw new Error('Invalid response from exchange rate API');
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error.message);
      // Use default rates if API fails
      this.exchangeRates = { USD: 1, EUR: 1, GBP: 1 }; // Add default rates
      this.lastUpdate = Date.now();
    }
  }

  async getExchangeRate(currency) {
    // For testing without API key, return 1 for all currencies
    if (!process.env.EXCHANGE_RATE_API_KEY) {
      return 1;
    }

    // Update rates if needed
    if (!this.lastUpdate || Date.now() - this.lastUpdate > this.UPDATE_INTERVAL) {
      await this.updateExchangeRates();
    }

    const rate = this.exchangeRates[currency];
    if (!rate) {
      throw new Error(`Exchange rate not available for currency: ${currency}`);
    }

    return rate;
  }
}

module.exports = new CurrencyService();
    // For testing/development
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_EXCHANGE_RATES === 'true') {
      const mockRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        // Add other currencies as needed
      };
      return mockRates[currency] || 1;
    }
*/
