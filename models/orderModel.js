const mongoose = require('mongoose');
const { PAYMENT_STATUS, ORDER_STATUS, SUPPORTED_CURRENCIES } = require('../utils/orderConstants');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  shippingMethod: {
    type: mongoose.Schema.ObjectId,
    ref: 'ShippingMethod',
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: Object.keys(SUPPORTED_CURRENCIES),
    required: true,
    default: 'USD'
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1
  },
  subtotalInUSD: {
    type: Number,
    required: true
  },
  totalInUSD: {
    type: Number,
    required: true
  },
  paymentIntentId: String,
  orderStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  }
  // work on the payment status schema too, set default to pending
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
