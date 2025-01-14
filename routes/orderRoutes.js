const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(orderController.createOrder)
  .get(orderController.getUserOrders);

router.get('/statistics', orderController.getUserStatistics);
router.post('/confirm', orderController.confirmOrder);
router.get('/:id', orderController.getOrder);

module.exports = router;
