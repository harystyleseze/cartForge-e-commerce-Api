const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  rating: {
    type: Number,
    required: [true, 'Review must have a rating'],
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5']
  },
  comment: {
    type: String,
    required: [true, 'Review must have a comment'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure a user can only review a product once
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { productId: new mongoose.Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      ratings: stats[0].ratingCount
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      averageRating: 0,
      ratings: 0
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.productId);
});

// Store the document before deletion
reviewSchema.pre('findOneAndDelete', async function(next) {
  // Find the document that's about to be deleted and store it
  this.doc = await this.model.findOne(this.getQuery());
  next();
});

// Calculate average after deletion
reviewSchema.post('findOneAndDelete', async function() {
  if (this.doc) {
    await this.model.calcAverageRating(this.doc.productId);
  }
});

// Add similar middleware for findByIdAndDelete
reviewSchema.pre('findByIdAndDelete', async function(next) {
  this.doc = await this.model.findOne({ _id: this.getQuery()._id });
  next();
});

reviewSchema.post('findByIdAndDelete', async function() {
  if (this.doc) {
    await this.model.calcAverageRating(this.doc.productId);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
