const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

const reviewService = {
  async createReview(userId, productId, reviewData) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    const review = await Review.create({
      userId,
      productId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });

    return await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('productId', 'name');
  },

  async getReviewById(reviewId) {
    const review = await Review.findById(reviewId)
      .populate('userId', 'name')
      .populate('productId', 'name');
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return review;
  },

  async getReviews(userId) {
    return await Review.find({ userId })
      .populate('productId', 'name')
      .sort('-createdAt');
  },

  async getReviewsForProduct(productId) {
    return await Review.find({ productId })
      .populate('userId', 'name')
      .sort('-createdAt');
  },

  async updateReview(reviewId, userId, reviewData) {
    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new Error('Review not found or you are not authorized to update this review');
    }

    Object.assign(review, reviewData);
    await review.save();

    return await Review.findById(review._id)
      .populate('userId', 'name')
      .populate('productId', 'name');
  },

  async deleteReview(reviewId, userId) {
    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) {
      throw new Error('Review not found or you are not authorized to delete this review');
    }
    return review;
  },

  async deleteReviewByAdmin(reviewId) {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }
};

module.exports = reviewService;
