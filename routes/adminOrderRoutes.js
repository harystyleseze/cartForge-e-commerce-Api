const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Protect all routes and restrict to admin only
router.use(protect);
router.use(isAdmin);

router.get('/statistics', adminOrderController.getStatistics);

router.route('/')
  .get(adminOrderController.getAllOrders);

router.route('/:orderId/status')
  .patch(adminOrderController.updateOrderStatus);

router.route('/:orderId/refund')
  .post(adminOrderController.processRefund);

module.exports = router;