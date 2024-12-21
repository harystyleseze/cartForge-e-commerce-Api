const express = require('express');
const router = express.Router();
const shippingMethodController = require('../controllers/shippingMethodController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Public routes
router.get('/available', shippingMethodController.getAvailableShippingMethods);
router.get('/', shippingMethodController.getAllShippingMethods);
router.get('/:id', shippingMethodController.getShippingMethod);
router.get('/:shippingMethodId/calculate', shippingMethodController.calculateShippingCost);


// Protected routes - Admin only
router.use(protect, isAdmin);
router.post('/', shippingMethodController.createShippingMethod);
router.put('/:id', shippingMethodController.updateShippingMethod);
router.delete('/:id', shippingMethodController.deleteShippingMethod);

module.exports = router;
