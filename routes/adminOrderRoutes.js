const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes and restrict to admin only
router.use(protect);

router.get('/', adminOrderController.getAllOrders);
router.patch('/:orderId/status', adminOrderController.updateOrderStatus);
router.post('/:orderId/refund', adminOrderController.processRefund);

module.exports = router;