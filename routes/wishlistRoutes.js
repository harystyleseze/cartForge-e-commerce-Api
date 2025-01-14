const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');
const { validateObjectId } = require('../middlewares/validateMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');

// Public routes (no authentication required)
router.get('/share/:linkId', 
    validateMiddleware.validateShareableLink, 
    wishlistController.getWishlistByLink
);
// Protected routes (require authentication)
router.use(protect);

router.post('/', validateObjectId('productId'), wishlistController.addToWishlist);
router.delete('/:productId', validateObjectId('productId'), wishlistController.removeFromWishlist);
router.get('/', wishlistController.getWishlist);
router.patch('/:productId', validateObjectId('productId'), wishlistController.updateWishlistItem);
router.get('/notifications', wishlistController.getNotifications);
router.post('/share', wishlistController.generateShareableLink);
router.delete('/share/expired', wishlistController.clearExpiredLinks);

module.exports = router;
