const orderService = require('../services/orderService');
const Order = require('../models/orderModel');

const orderController = {
  async createOrder(req, res) {
    try {
      const { shippingMethodId, shippingAddress, currency, couponCode } = req.body;
      
      const result = await orderService.createOrder(req.user.id, {
        shippingMethodId,
        shippingAddress,
        currency,
        couponCode
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
      console.log('Getting order:', req.params.id, 'for user:', req.user.id);

      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.id
      }).populate([
        {
          path: 'items.product',
          select: 'name price images description'
        },
        {
          path: 'shippingMethod',
          select: 'name cost estimatedDays'
        }
      ]);

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
      console.error('Error getting order:', error);
      res.status(error.name === 'CastError' ? 404 : 400).json({
        status: 'error',
        message: error.name === 'CastError' ? 'Invalid order ID' : error.message
      });
    }
  },

  async getUserOrders(req, res) {
    try {
      const orders = await orderService.getUserOrders(req.user.id, req.query);
      
      res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getUserStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const statistics = await orderService.getUserStatistics(req.user.id, { 
        startDate, 
        endDate 
      });
      
      res.status(200).json({
        status: 'success',
        data: { statistics }
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