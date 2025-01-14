const reviewService = require('../services/reviewService');

const reviewController = {
  async createReview(req, res) {
    try {
      const review = await reviewService.createReview(
        req.user.id,
        req.params.productId,
        req.body
      );
      
      res.status(201).json({
        status: 'success',
        data: { review }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getReviewById(req, res) {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      
      res.status(200).json({
        status: 'success',
        data: { review }
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getReviews(req, res) {
    try {
      const reviews = await reviewService.getReviews(req.params.userId);
      
      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getReviewsForProduct(req, res) {
    try {
      const reviews = await reviewService.getReviewsForProduct(req.params.productId);
      
      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateReview(req, res) {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.user.id,
        req.body
      );
      
      res.status(200).json({
        status: 'success',
        data: { review }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteReview(req, res) {
    try {
      await reviewService.deleteReview(req.params.id, req.user.id);
      
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteReviewByAdmin(req, res) {
    try {
      await reviewService.deleteReviewByAdmin(req.params.id);
      
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = reviewController;
