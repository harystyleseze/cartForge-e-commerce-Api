const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes - Admin only
router.use(protect, isAdmin);
router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.patch('/:id/images', upload.array('images', 5), productController.updateProductImages);
router.delete('/:id', productController.deleteProduct);
router.delete('/:id/images/:imageId', productController.deleteProductImage);
router.patch('/:id/stock', productController.updateProductStock);

module.exports = router;
