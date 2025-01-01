const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authService = {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  },
  async register(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  },

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }
    return user;
  },

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },
};

module.exports = authService;
