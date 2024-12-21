const orderService = require('../services/orderService');
const notificationService = require('../services/notificationService');

const adminOrderController = {
  async getAllOrders(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const orders = await orderService.getAllOrders({ status, page, limit });
      
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

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const order = await orderService.updateOrderStatus(orderId, status);
      
      // Send notification to user about order status update
      await notificationService.sendOrderStatusUpdate(order);

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

  async processRefund(req, res) {
    try {
      const { orderId } = req.params;
      const { amount, reason } = req.body;
      
      const refund = await orderService.processRefund(orderId, amount, reason);
      
      // Send notification to user about refund
      await notificationService.sendRefundNotification(refund);

      res.status(200).json({
        status: 'success',
        data: { refund }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = adminOrderController;