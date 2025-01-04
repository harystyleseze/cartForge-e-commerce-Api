const User = require('../models/userModel');
const userService = require('../services/userService');

const userController = {
  async getProfile(req, res) {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Controller to handle updating a user's role
  async updateRole(req, res) {
    try {
      const { id } = req.params;  // Get the user ID from the route parameter
      const { role } = req.body;  // Get the role from the request body

      // Call the service to update the user's role
      const updatedUser = await userService.updateRole(id, { role });

      // Return a success response with the updated user
      res.status(200).json({
        status: 'success',
        message: 'User role updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      // Handle errors (e.g., user not found, invalid role, etc.)
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },



  async updateProfile(req, res) {
    try {
      const { email, name, phone } = req.body;
      const user = await userService.updateUserProfile(req.user.id, { email, name, phone });
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async addAddress(req, res) {
    try {
      const user = await userService.addUserAddress(req.user.id, req.body);
      
      res.status(201).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateAddress(req, res) {
    try {
      const { addressId } = req.params;
      const user = await userService.updateUserAddress(req.user.id, addressId, req.body);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteAddress(req, res) {
    try {
      const { addressId } = req.params;
      const user = await userService.deleteUserAddress(req.user.id, addressId);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async setDefaultAddress(req, res) {
    try {
      const { addressId } = req.params;
      const user = await userService.setDefaultAddress(req.user.id, addressId);
      
      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      
      res.status(200).json({
        status: 'success',
        data: { users }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = userController;
