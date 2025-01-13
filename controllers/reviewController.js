const reviewService = require('../services/reviewService');

const reviewController = {
  async createReview(req, res) {
    try {
      const { productId } = req.params;
      const userId = req.user._id;
      const reviewData = req.body;
      
      const review = await reviewService.createReview(productId, reviewData, userId);
      
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

  async getReviewsForProduct(req, res) {
    try {
      const { productId } = req.params;
      const reviews = await reviewService.getReviewsForProduct(productId);

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
    // Get all reviews for a specific product
  async getReviews(req, res) {
    try {
      const reviews = await reviewService.getAllReviewsByProduct(req.params.productId);
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

  async getReviewById(req, res) {
    try {
      const review = await reviewService.getReviewById(req.params.id);

      if (!review) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found'
        });
      }

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

  async updateReview(req, res) {
    try {
        const { reviewId } = req.params.id;
        const review = await reviewService.updateReview(reviewId);
    //   const review = await reviewService.updateReview(req.params.id, req.body);

      if (!review) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found'
        });
      }

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
        const { reviewId } = req.params.id;
      const review = await reviewService.deleteReview(reviewId);

      if (!review) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found'
        });
      }

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

// const reviewService = require('../services/reviewService');

// const reviewController = {
//   // Create a review
//   async createReview(req, res) {
//     try {
//       const reviewData = { 
//         ...req.body,
//         userId: req.user._id,
//         productId: req.params.productId
//       };

//       const review = await reviewService.createReview(reviewData);
//       res.status(201).json({
//         status: 'success',
//         data: { review }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   },

//   // Get all reviews for a specific product
//   async getReviews(req, res) {
//     try {
//       const reviews = await reviewService.getAllReviewsByProduct(req.params.productId);
//       res.status(200).json({
//         status: 'success',
//         results: reviews.length,
//         data: { reviews }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   },

//   // Update a review
//   async updateReview(req, res) {
//     try {
//       const review = await reviewService.getReviewByUserAndProduct(req.user._id, req.params.productId);

//       if (!review) {
//         return res.status(404).json({
//           status: 'error',
//           message: 'Review not found'
//         });
//       }

//       const updatedReview = await reviewService.updateReview(review._id, req.body);
//       res.status(200).json({
//         status: 'success',
//         data: { review: updatedReview }
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   },

//   // Delete a review
//   async deleteReview(req, res) {
//     try {
//       const review = await reviewService.getReviewByUserAndProduct(req.user._id, req.params.productId);

//       if (!review) {
//         return res.status(404).json({
//           status: 'error',
//           message: 'Review not found'
//         });
//       }

//       await reviewService.deleteReview(review._id);
//       res.status(204).json({
//         status: 'success',
//         data: null
//       });
//     } catch (error) {
//       res.status(400).json({
//         status: 'error',
//         message: error.message
//       });
//     }
//   }
// };

// module.exports = reviewController;
