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
      
      // Try to send notification, but don't fail if it errors
      try {
        await notificationService.sendOrderStatusUpdate(order);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Continue processing even if email fails
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
  },

  async processRefund(req, res) {
    try {
      const { orderId } = req.params;
      const { amount, reason } = req.body;
      
      const refundData = await orderService.processRefund(orderId, amount, reason);
      
      // Try to send notification, but don't fail if it errors
      try {
        await notificationService.sendRefundNotification(refundData);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Continue processing even if email fails
      }

      res.status(200).json({
        status: 'success',
        data: refundData
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const statistics = await orderService.getAdminStatistics({ 
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

module.exports = adminOrderController;