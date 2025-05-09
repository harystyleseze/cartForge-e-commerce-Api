const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Protected routes - require authentication
router.use(protect);

// Get all users
router.get('/all', userController.getAllUsers);
// Route to update user's role to admin (admin only)
router.put('/updaterole/:id', isAdmin, userController.updateRole);
// Add delete user route (admin only)
router.delete('/:id', isAdmin, userController.deleteUser);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Address routes
router.post('/addresses', userController.addAddress);
router.put('/addresses/:addressId', userController.updateAddress);
router.delete('/addresses/:addressId', userController.deleteAddress);
router.patch('/addresses/:addressId/default', userController.setDefaultAddress);

module.exports = router;
