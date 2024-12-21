const User = require('../models/userModel');

const userService = {
  async getUserProfile(userId) {
    return await User.findById(userId).select('-password');
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
  }
};

module.exports = userService;
