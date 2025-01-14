const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

const couponService = {
  async createCoupon(couponData) {
    return await Coupon.create(couponData);
  },

  async getAllCoupons({ status, page = 1, limit = 10 }) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    return await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  async updateCoupon(couponId, updateData) {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // Prevent updating certain fields directly
    delete updateData.usageCount;
    delete updateData.code; // Prevent changing coupon code

    return await Coupon.findByIdAndUpdate(
      couponId,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteCoupon(couponId) {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    await Coupon.findByIdAndDelete(couponId);
  },

  async validateCoupon(code, userId, cartTotal, categories = []) {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check if coupon is active
    if (coupon.status !== 'active') {
      throw new Error('Coupon is inactive or expired');
    }

    // Check expiration
    if (Date.now() > coupon.validUntil) {
      coupon.status = 'expired';
      await coupon.save();
      throw new Error('Coupon has expired');
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit has been reached');
    }

    // Check minimum order value
    if (cartTotal < coupon.minimumOrderValue) {
      throw new Error(`Order must be at least $${coupon.minimumOrderValue} to use this coupon`);
    }

    // Check category restrictions
    if (coupon.applicableCategories.length > 0) {
      const hasValidCategory = categories.some(category => 
        coupon.applicableCategories.includes(category)
      );
      if (!hasValidCategory) {
        throw new Error('Coupon is not valid for these products');
      }
    }

    // Check customer restrictions
    if (coupon.customerRestrictions.newCustomersOnly || coupon.customerRestrictions.vipOnly) {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (coupon.customerRestrictions.newCustomersOnly && user.orderCount > 0) {
        throw new Error('This coupon is for new customers only');
      }

      if (coupon.customerRestrictions.vipOnly && !user.isVIP) {
        throw new Error('This coupon is for VIP customers only');
      }
    }

    return coupon;
  },

  async calculateDiscount(coupon, cartTotal, items = []) {
    let discount = 0;

    switch (coupon.discountType) {
      case 'percentage':
        discount = (cartTotal * coupon.discountValue) / 100;
        // Ensure percentage discount doesn't exceed cart total
        discount = Math.min(discount, cartTotal);
        break;
      
      case 'fixed':
        // Fixed amount discount
        discount = Math.min(coupon.discountValue, cartTotal);
        break;
      
      case 'freeShipping':
        // This will be handled in order service
        discount = 0;
        break;
      
      case 'buyXgetY':
        if (!items.length) return 0;
        discount = this.calculateBuyXGetYDiscount(items, coupon.buyXgetY);
        break;

      default:
        throw new Error('Invalid discount type');
    }

    // Round to 2 decimal places
    return Math.round(discount * 100) / 100;
  },

  async applyCoupon(couponId) {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new Error('Coupon not found');
    
    coupon.usageCount += 1;
    await coupon.save();
  },

  calculateBuyXGetYDiscount(items, buyXgetY) {
    if (!buyXgetY || !buyXgetY.buyQuantity || !buyXgetY.getQuantity) {
      return 0;
    }

    let totalDiscount = 0;
    
    // Group items by product
    const groupedItems = items.reduce((acc, item) => {
      const key = item.productId.toString();
      if (!acc[key]) {
        acc[key] = {
          quantity: 0,
          price: item.price
        };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {});

    // Calculate discount for each product group
    Object.values(groupedItems).forEach(item => {
      const { buyQuantity, getQuantity } = buyXgetY;
      const totalQuantity = item.quantity;
      const sets = Math.floor(totalQuantity / (buyQuantity + getQuantity));
      const discountQuantity = sets * getQuantity;
      totalDiscount += discountQuantity * item.price;
    });

    return totalDiscount;
  }
};

module.exports = couponService;
