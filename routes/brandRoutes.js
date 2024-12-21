const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrand);

// Protected routes - Admin only
router.use(protect, isAdmin);
router.post('/', upload.single('logo'), brandController.createBrand);
router.put('/:id', upload.single('logo'), brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
