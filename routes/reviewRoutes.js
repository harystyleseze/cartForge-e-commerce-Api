const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public route to get reviews of product
router.get('/:id', reviewController.getReviewById);
router.get('/product/:productId', reviewController.getReviews);
router.get('/product/:productId/reviews', reviewController.getReviewsForProduct);

// Protected routes for creating, updating, and deleting reviews
router.use(protect);
router.post('/product/:productId/reviews', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
