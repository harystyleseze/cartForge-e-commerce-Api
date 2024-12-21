const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', orderController.createOrder);
router.post('/confirm', orderController.confirmOrder);
router.get('/:id', orderController.getOrder);

module.exports = router;
