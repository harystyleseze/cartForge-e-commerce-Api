const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock quantity must be an integer'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category']
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: [true, 'Product must belong to a brand']
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be below 5'],
    set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be below 5'],
    set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
  },
  imagePublicId: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'productId',
  localField: '_id'
});

// Indexing for search
productSchema.index({ name: 'text', description: 'text' });

// Update average rating and review count whenever a review is added, updated, or deleted
productSchema.methods.updateRatingAndReviewsCount = async function() {
  // Fetch reviews directly from the Review model
  const reviews = await Review.find({ productId: this._id });

  // Calculate total rating and count
  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const reviewsCount = reviews.length;

  // Update the product's average rating and reviews count
    // Set the new average rating (rounded to 1 decimal place) and reviews count
    this.averageRating = reviewsCount > 0 ? (totalRatings / reviewsCount).toFixed(1) : 0;
    this.reviewsCount = reviewsCount;
  
  // Save the updated product document
  await this.save();
  // Error Handling
  const updatedProduct = await Product.findById(this._id);
  console.log('Updated product:', updatedProduct);

};

// Model
module.exports = mongoose.model('Product', productSchema);
