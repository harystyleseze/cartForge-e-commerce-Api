const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'fixed', 'freeShipping', 'buyXgetY']
  },
  discountValue: {
    type: Number,
    required: function() {
      // Only required for percentage and fixed discount types
      return ['percentage', 'fixed'].includes(this.discountType);
    },
    min: [0, 'Discount value cannot be negative'],
    validate: {
      validator: function(value) {
        if (this.discountType === 'percentage' && value > 100) {
          return false;
        }
        return true;
      },
      message: 'Percentage discount cannot exceed 100%'
    }
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required'],
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  applicableCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  customerRestrictions: {
    newCustomersOnly: {
      type: Boolean,
      default: false
    },
    vipOnly: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  buyXgetY: {
    buyQuantity: {
      type: Number,
      required: function() {
        return this.discountType === 'buyXgetY';
      },
      min: [1, 'Buy quantity must be at least 1']
    },
    getQuantity: {
      type: Number,
      required: function() {
        return this.discountType === 'buyXgetY';
      },
      min: [1, 'Get quantity must be at least 1']
    }
  }
}, { timestamps: true });

// Pre-save middleware to validate based on discount type
couponSchema.pre('save', function(next) {
  if (this.validUntil < this.validFrom) {
    next(new Error('Expiration date must be after valid from date'));
  }

  // Validate based on discount type
  switch (this.discountType) {
    case 'percentage':
      if (!this.discountValue || this.discountValue > 100) {
        next(new Error('Percentage discount must be between 0 and 100'));
      }
      break;
    case 'fixed':
      if (!this.discountValue || this.discountValue < 0) {
        next(new Error('Fixed discount must be greater than 0'));
      }
      break;
    case 'buyXgetY':
      if (!this.buyXgetY || !this.buyXgetY.buyQuantity || !this.buyXgetY.getQuantity) {
        next(new Error('Buy X Get Y quantities are required'));
      }
      break;
    case 'freeShipping':
      // No additional validation needed
      break;
  }

  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
