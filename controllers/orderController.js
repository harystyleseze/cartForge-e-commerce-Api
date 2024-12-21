const orderService = require('../services/orderService');
const Order = require('../models/orderModel');

const orderController = {
  async createOrder(req, res) {
    try {
      const { shippingMethodId, shippingAddress, currency } = req.body;
      
      const result = await orderService.createOrder(req.user.id, {
        shippingMethodId,
        shippingAddress,
        currency
      });

      res.status(201).json({
        status: 'success',
        data: {
          order: result.order,
          clientSecret: result.clientSecret
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async confirmOrder(req, res) {
    try {
      const { paymentIntentId } = req.body;
      const order = await orderService.confirmOrder(paymentIntentId);

      res.status(200).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.id
      }).populate('items.product shippingMethod');

      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: { order }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = orderController;