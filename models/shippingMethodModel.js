const mongoose = require('mongoose');

const regionPricingSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    enum: ['domestic', 'north-america', 'europe', 'asia', 'oceania', 'africa', 'south-america']
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKg: {
    type: Number,
    required: true,
    min: 0
  },
  freeShippingThreshold: {
    type: Number,
    min: 0
  }
});

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shipping method name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Shipping price is required'],
    min: [0, 'Price cannot be negative']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'standard',
      'express',
      'next-day',
      'same-day',
      'international',
      'free',
      'flat-rate',
      'local-delivery',
      'courier',
      'drop-shipping',
      'ship-to-store',
      'subscription',
      'white-glove'
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  regionPricing: [regionPricingSchema],
  restrictions: {
    minWeight: { type: Number },
    maxWeight: { type: Number },
    minOrderAmount: { type: Number },
    allowedCountries: [String],
    allowedRegions: [{
      type: String,
      enum: ['domestic', 'north-america', 'europe', 'asia', 'oceania', 'africa', 'south-america']
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);
