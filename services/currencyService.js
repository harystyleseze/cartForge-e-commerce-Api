const axios = require('axios');
const { SUPPORTED_CURRENCIES } = require('../utils/orderConstants');

class CurrencyService {
  constructor() {
    this.exchangeRates = {};
    this.lastUpdate = null;
    this.updateInterval = 1000 * 60 * 60; // 1 hour
  }

  async updateExchangeRates() {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
      );

      this.exchangeRates = response.data.conversion_rates;
      this.lastUpdate = Date.now();
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      throw new Error('Currency exchange rate service unavailable');
    }
  }

  async getExchangeRate(currency) {

    if (!SUPPORTED_CURRENCIES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    if (!this.lastUpdate || Date.now() - this.lastUpdate > this.updateInterval) {
      await this.updateExchangeRates();
    }

    return this.exchangeRates[currency] || 1;
  }

  async convertToUSD(amount, fromCurrency) {
    const rate = await this.getExchangeRate(fromCurrency);
    return amount / rate;
  }

  async convertFromUSD(amount, toCurrency) {
    const rate = await this.getExchangeRate(toCurrency);
    return amount * rate;
  }
}

module.exports = new CurrencyService();