const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Public routes
router.get('/:id', reviewController.getReviewById);
router.get('/product/:userId', reviewController.getReviews);
router.get('/product/:productId/reviews', reviewController.getReviewsForProduct);

// Protected routes
router.use(protect);
router.post('/product/:productId/reviews', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

// Admin routes
router.delete('/admin/:id', isAdmin, reviewController.deleteReviewByAdmin);

module.exports = router;
