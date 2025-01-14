const couponService = require('../services/couponService');

const couponController = {
  async createCoupon(req, res) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({
        status: 'success',
        data: { coupon }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAllCoupons(req, res) {
    try {
      const coupons = await couponService.getAllCoupons(req.query);
      res.status(200).json({
        status: 'success',
        data: { coupons }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateCoupon(req, res) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: { coupon }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteCoupon(req, res) {
    try {
      await couponService.deleteCoupon(req.params.id);
      res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async validateCoupon(req, res) {
    try {
      const { code } = req.params;
      const { cartTotal, categories = [], items = [] } = req.body;
      
      if (!cartTotal) {
        throw new Error('Cart total is required');
      }

      const coupon = await couponService.validateCoupon(
        code,
        req.user.id,
        cartTotal,
        categories
      );

      const discount = await couponService.calculateDiscount(
        coupon,
        cartTotal,
        items
      );

      res.status(200).json({
        status: 'success',
        data: { 
          coupon,
          discount,
          finalTotal: cartTotal - discount
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = couponController;
