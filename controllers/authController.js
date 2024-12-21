const authService = require('../services/authService');

const authController = {
  async register(req, res) {
    try {
      const existingUser = await authService.findUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      const { address, ...userData } = req.body;
      const user = await authService.register(userData);
      
      if (address) {
        address.isDefault = true;
        user.addresses.push(address);
        await user.save();
      }

      const token = authService.generateToken(user._id);
      user.password = undefined;

      res.status(201).json({
        status: 'success',
        token,
        data: { user }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      const token = authService.generateToken(user._id);
      user.password = undefined;

      res.status(200).json({
        status: 'success',
        token,
        data: { user }
      });
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = authController;
