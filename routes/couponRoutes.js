const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Admin routes
router.route('/')
  .post(isAdmin, couponController.createCoupon)
  .get(isAdmin, couponController.getAllCoupons);

router.route('/:id')
  .patch(isAdmin, couponController.updateCoupon)
  .delete(isAdmin, couponController.deleteCoupon);

// Public routes (still need authentication)
router.post('/validate/:code', couponController.validateCoupon);

module.exports = router;
