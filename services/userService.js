const User = require('../models/userModel');
const mongoose = require('mongoose');

const userService = {
  async getUserProfile(userId) {
    return await User.findById(userId).select('-password');
  },

  async updateRole(userId, updateData) {
    try {
      // Use findByIdAndUpdate with { new: true } and { runValidators: true }
      const updatedUser = await User.findByIdAndUpdate(
        userId, // The userId to find the user
        updateData, // The data to update (including the new role)
        { 
          new: true,        // Return the updated document (not the old one)
          runValidators: true // Ensure validators are run on the updated fields
        }
      ).select('-password'); // Exclude the password field from the result

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;  // Return the updated user
    } catch (error) {
      throw new Error(error.message);  // Propagate the error to be handled by the controller
    }
  },

  async updateUserProfile(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  },

  async addUserAddress(userId, addressData) {
    const user = await User.findById(userId);
    
    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }
    
    user.addresses.push(addressData);
    await user.save();
    
    return user;
  },

  async updateUserAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      throw new Error('Address not found');
    }
    
    Object.assign(address, addressData);
    await user.save();
    
    return user;
  },

  async deleteUserAddress(userId, addressId) {
    const user = await User.findById(userId);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      throw new Error('Address not found');
    }
    
    // If deleting default address, make another address default
    if (address.isDefault && user.addresses.length > 1) {
      const newDefault = user.addresses.find(addr => addr._id.toString() !== addressId);
      newDefault.isDefault = true;
    }
    
    user.addresses.pull(addressId);
    await user.save();
    
    return user;
  },

  async setDefaultAddress(userId, addressId) {
    const user = await User.findById(userId);
    const newDefaultAddress = user.addresses.id(addressId);
    
    if (!newDefaultAddress) {
      throw new Error('Address not found');
    }
    
    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set new default
    newDefaultAddress.isDefault = true;
    await user.save();
    
    return user;
  },

  // Add this method to the existing userService object
  async getAllUsers() {
    return await User.find().select('-password');
  },

  async deleteUser(userId) {
    try {
      // Find user first to check if exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Delete associated cart if exists
      if (user.cart) {
        await mongoose.model('Cart').findByIdAndDelete(user.cart);
      }

      // Delete user's reviews
      await mongoose.model('Review').deleteMany({ userId: user._id });

      // Delete user's orders
      await mongoose.model('Order').deleteMany({ userId: user._id });

      // Delete user's wishlist
      await mongoose.model('Wishlist').deleteMany({ userId: user._id });

      // Finally delete the user
      await User.findByIdAndDelete(userId);

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = userService;
