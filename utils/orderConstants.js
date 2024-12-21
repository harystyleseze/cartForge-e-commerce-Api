module.exports = {
    PAYMENT_STATUS: {
      PENDING: 'pending',
      PAID: 'paid',
      FAILED: 'failed'
    },
    ORDER_STATUS: {
      PENDING: 'pending',
      PROCESSING: 'processing',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled'
    },
    SUPPORTED_CURRENCIES: {
      USD: {
        code: 'USD',
        symbol: '$',
        minimumAmount: 0.50
      },
      EUR: {
        code: 'EUR',
        symbol: '€',
        minimumAmount: 0.50
      },
      GBP: {
        code: 'GBP',
        symbol: '£',
        minimumAmount: 0.30
      },
      JPY: {
        code: 'JPY',
        symbol: '¥',
        minimumAmount: 50
      },
      AUD: {
        code: 'AUD',
        symbol: 'A$',
        minimumAmount: 0.50
      },
      CAD: {
        code: 'CAD',
        symbol: 'C$',
        minimumAmount: 0.50
      }
    }
  };