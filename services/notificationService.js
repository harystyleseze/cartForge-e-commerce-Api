const nodemailer = require('nodemailer');
const User = require('../models/userModel');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const notificationService = {
  async sendOrderStatusUpdate(order) {
    // const user = await User.findById(order.user);
    
    // Temporarily Disabled Email Sending
    // const message = {
    //   to: user.email,
    //   subject: `Order Status Update - ${order.orderStatus}`,
    //   html: `
    //     <h1>Order Status Update</h1>
    //     <p>Your order #${order._id} has been updated to: ${order.orderStatus}</p>
    //     <p>Thank you for shopping with us!</p>
    //   `
    // };

    // await transporter.sendMail(message);
        // Temporarily disable email sending
        console.log('Email notification disabled:', {
          orderId: order._id,
          status: order.orderStatus
        });
        return true;
  },

  // async sendRefundNotification(refund) {
    // const user = await User.findById(refund.userId);
    
    // const message = {
    //   to: user.email,
    //   subject: 'Refund Processed',
    //   html: `
    //     <h1>Refund Processed</h1>
    //     <p>A refund of ${refund.amount} has been processed for your order #${refund.orderId}</p>
    //     <p>Reason: ${refund.reason}</p>
    //     <p>The refund should appear in your account within 5-7 business days.</p>
    //   `
    // };

    // await transporter.sendMail(message);
        // Temporarily disable email sending
  //   console.log('Refund notification disabled:', {
  //     orderId: refundData.order.id,
  //     refundAmount: refundData.refund.amount,
  //     refundStatus: refundData.order.refundStatus
  //   });
  //   return true;
  // }
  async sendRefundNotification(refundData) {
    try {
      // Temporarily disable email sending
      console.log('Refund notification disabled:', {
        orderId: refundData.order.id,
        refundAmount: refundData.refund.amount,
        refundStatus: refundData.order.refundStatus
      });
      return true;
    } catch (error) {
      console.error('Error sending refund notification:', error);
      // Don't throw error, just log it
      return false;
    }
  }

};

module.exports = notificationService;