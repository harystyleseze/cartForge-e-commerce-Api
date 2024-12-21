const cartService = require('../services/cartService');

const cartController = {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { cart }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.addToCart(req.user.id, productId, quantity);
      res.status(200).json({
        status: 'success',
        data: { cart }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await cartService.updateCartItem(req.user.id, productId, quantity);
      res.status(200).json({
        status: 'success',
        data: { cart }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async removeFromCart(req, res) {
    try {
      const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
      res.status(200).json({
        status: 'success',
        data: { cart }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { cart }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = cartController;
