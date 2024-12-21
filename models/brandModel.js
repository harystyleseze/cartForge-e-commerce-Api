const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    url: String,
    publicId: String
  },
  slug: {
    type: String,
    unique: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for products of this brand
brandSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'brand',
  localField: '_id'
});

// Pre-save middleware to create slug from name
brandSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
