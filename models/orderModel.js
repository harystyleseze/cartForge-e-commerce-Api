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
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'other'],
    required: true,
    default: 'card'
  },
  orderStatus: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true
  },
  refundStatus: {
    type: String,
    enum: ['none', 'partial', 'full'],
    default: 'none'
  },
  refundedAmount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating remaining refundable amount
orderSchema.virtual('refundableAmount').get(function() {
  return this.finalTotal - this.refundedAmount;
});

// Pre-save middleware to update refund status
orderSchema.pre('save', function(next) {
  if (this.refundedAmount > 0) {
    this.refundStatus = this.refundedAmount >= this.finalTotal ? 'full' : 'partial';
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
