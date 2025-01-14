const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
// Comment out this line
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const shippingMethodService = require('./shippingMethodService');
const currencyService = require('./currencyService');
const { SUPPORTED_CURRENCIES, PAYMENT_STATUS, ORDER_STATUS } = require('../utils/orderConstants');
const Refund = require('../models/refundModel');
const couponService = require('./couponService');
const stripe = require('./dummyStripeService'); // Replace Stripe with dummy service

const orderService = {
  async createOrder(userId, orderData) {
    const { currency = 'USD' } = orderData;

    if (!SUPPORTED_CURRENCIES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Get exchange rate
    const exchangeRate = await currencyService.getExchangeRate(currency);

    // Calculate shipping cost in USD
    const shippingCostUSD = await shippingMethodService.calculateShippingCost(
      orderData.shippingMethodId,
      {
        weight: cart.items.reduce((total, item) => 
          total + (item.product.weight || 0) * item.quantity, 0),
        totalAmount: cart.totalAmount,
        countryCode: orderData.shippingAddress.country
      }
    );

    // Convert amounts to requested currency
    const subtotal = cart.totalAmount * exchangeRate;
    const shippingCost = shippingCostUSD.cost * exchangeRate;
    const total = subtotal + shippingCost;

    // Ensure minimum amount requirement is met
    const minimumAmount = SUPPORTED_CURRENCIES[currency].minimumAmount;
    if (total < minimumAmount) {
      throw new Error(`Order total must be at least ${minimumAmount} ${currency}`);
    }

    let discount = 0;
    let coupon = null;

    // Apply coupon if provided
    if (orderData.couponCode) {
      try {
        coupon = await couponService.validateCoupon(
          orderData.couponCode,
          userId,
          subtotal,
          cart.items.map(item => item.product.category)
        );

        // Calculate discount
        discount = await couponService.calculateDiscount(
          coupon,
          subtotal,
          cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          }))
        );

        // Handle free shipping coupon
        if (coupon.discountType === 'freeShipping') {
          shippingCost = 0;
        }

        // Update coupon usage
        await couponService.applyCoupon(coupon._id);
      } catch (error) {
        throw new Error(`Coupon error: ${error.message}`);
      }
    }

    // Calculate final total
    const finalTotal = total - discount;

    // Create Stripe payment intent - Comment out this line
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(total * 100), // Convert to smallest currency unit
    //   currency: currency.toLowerCase(),
    //   metadata: {
    //     userId: userId.toString(),
    //     orderItems: JSON.stringify(cart.items.map(item => ({
    //       productId: item.product._id.toString(),
    //       quantity: item.quantity
    //     })))
    //   }
    // });

    // Add this dummy payment intent data
    const dummyPaymentIntent = {
        id: `pi_dummy_${Date.now()}`,
        client_secret: `dummy_secret_${Date.now()}`,
        amount: Math.round(total * 100),
        currency: currency.toLowerCase(),
        status: 'requires_payment_method'
    };

    // // Create order - actual code with stripe payment
    // const order = await Order.create({
    //   user: userId,
    //   items: cart.items.map(item => ({
    //     product: item.product._id,
    //     quantity: item.quantity,
    //     price: item.price * exchangeRate
    //   })),
    //   shippingAddress: orderData.shippingAddress,
    //   shippingMethod: orderData.shippingMethodId,
    //   shippingCost,
    //   subtotal,
    //   total,
    //   currency,
    //   exchangeRate,
    //   subtotalInUSD: cart.totalAmount,
    //   totalInUSD: (cart.totalAmount + shippingCostUSD.cost),
    //   paymentIntentId: paymentIntent.id
    // });

    // Create order - dummy payment intent for testing
    const order = await Order.create({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price * exchangeRate
      })),
      shippingAddress: orderData.shippingAddress,
      shippingMethod: orderData.shippingMethodId,
      shippingCost,
      subtotal,
      total,
      currency,
      exchangeRate,
      subtotalInUSD: cart.totalAmount,
      totalInUSD: (cart.totalAmount + shippingCostUSD.cost),
      couponCode: coupon?.code,
      couponDiscount: discount,
      finalTotal: finalTotal,
      paymentIntentId: dummyPaymentIntent.id,
      paymentStatus: PAYMENT_STATUS.PENDING,
      orderStatus: ORDER_STATUS.PENDING
    });

    // Clear cart after order creation
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0, totalQuantity: 0 } }
    );

    // Dummy payment intent for testing
    return {
        order,
        clientSecret: dummyPaymentIntent.client_secret
      };
    },


// Actual code with stripe payment - commented for testing
//     return {
//       order,
//       clientSecret: paymentIntent.client_secret
//     };
//   },

// actual code with stripe payment
//   async confirmOrder(paymentIntentId) {
//     const order = await Order.findOne({ paymentIntentId });
//     if (!order) {
//       throw new Error('Order not found');
//     }

//     // Update order status
//     order.paymentStatus = 'paid';
//     order.orderStatus = 'processing';
//     await order.save();

//     // Update product stock
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stockQuantity: -item.quantity }
//       });
//     }

//     return order;
//   }

// dummy confirmation order intent for testing
async confirmOrder(paymentIntentId) {
    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId });
    
    if (!order) {
      console.log('No order found with paymentIntentId:', paymentIntentId);
      throw new Error('Order not found');
    }

    // In a real implementation, you would verify the payment with Stripe
    // For testing, we'll simulate payment confirmation
    order.paymentStatus = PAYMENT_STATUS.PAID;
    order.orderStatus = ORDER_STATUS.PROCESSING;

    // Save the updated order
    await order.save();

    return order;
  },

  async getAllOrders({ status, page, limit }) {
    const query = status ? { orderStatus: status } : {};
    const skip = (page - 1) * limit;
    
    return await Order.find(query)
      .populate('user', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate status transition
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['completed'],
      cancelled: [],
      completed: []
    };

    if (!validTransitions[order.orderStatus].includes(status)) {
      throw new Error(`Invalid status transition from ${order.orderStatus} to ${status}`);
    }

    // Additional validation for payment status
    if (status === 'processing' && order.paymentStatus !== 'paid') {
      throw new Error('Cannot process order: payment not confirmed');
    }

    order.orderStatus = status;
    
    // Auto-update payment status for certain order status changes
    if (status === 'cancelled' && order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    return await order.save();
  },

  async processRefund(orderId, amount, reason) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (!order.paymentIntentId) {
      throw new Error('No payment intent found for this order');
    }

    if (amount > order.refundableAmount) {
      throw new Error('Refund amount exceeds refundable amount');
    }

    // Process refund through dummy Stripe -- testing purpose
    const stripeRefund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: Math.round(amount * 100),
      reason: reason || 'requested_by_customer'
    });

    // Create refund record
    const refundRecord = await Refund.create({
      orderId,
      userId: order.user,
      amount,
      reason,
      stripeRefundId: stripeRefund.id,
      status: stripeRefund.status
    });

    // Update order
    order.refundedAmount += amount;
    
    // Update refund status
    if (order.refundedAmount >= order.finalTotal) {
      order.refundStatus = 'full';
      order.orderStatus = ORDER_STATUS.CANCELLED;
      order.paymentStatus = PAYMENT_STATUS.REFUNDED;
    } else {
      order.refundStatus = 'partial';
      order.paymentStatus = PAYMENT_STATUS.PARTIALLY_REFUNDED;
    }

    await order.save();

    return {
      refund: refundRecord,
      order: {
        id: order._id,
        refundStatus: order.refundStatus,
        refundedAmount: order.refundedAmount,
        remainingAmount: order.refundableAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    };
  },

  async getUserOrder(orderId, userId) {
    const order = await Order.findOne({
      _id: orderId,
      user: userId
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
      throw new Error('Order not found');
    }

    return order;
  },

  // Add a method to get all orders for a user
  async getUserOrders(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: userId })
      .populate([
        {
          path: 'items.product',
          select: 'name price images'
        },
        {
          path: 'shippingMethod',
          select: 'name'
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return orders;
  },

  async getUserStatistics(userId, { startDate, endDate } = {}) {
    const query = { user: userId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query);
    const totalOrders = orders.length;

    const statistics = {
      totalOrders,
      orderStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        completed: 0
      },
      totalSpent: 0,
      refundedAmount: 0,
      discountsUsed: 0,
      averageOrderValue: 0
    };

    orders.forEach(order => {
      statistics.orderStatus[order.orderStatus]++;
      if (['paid', 'partially_refunded'].includes(order.paymentStatus)) {
        statistics.totalSpent += order.finalTotal || 0;
      }
      statistics.refundedAmount += order.refundedAmount || 0;
      statistics.discountsUsed += order.couponDiscount || 0;
    });

    const paidOrders = orders.filter(order => 
      ['paid', 'partially_refunded'].includes(order.paymentStatus)
    ).length;

    statistics.averageOrderValue = paidOrders > 0 ? 
      statistics.totalSpent / paidOrders : 0;

    statistics.totalSpent = Number(statistics.totalSpent.toFixed(2));
    statistics.refundedAmount = Number(statistics.refundedAmount.toFixed(2));
    statistics.discountsUsed = Number(statistics.discountsUsed.toFixed(2));
    statistics.averageOrderValue = Number(statistics.averageOrderValue.toFixed(2));

    return statistics;
  },

  async getAdminStatistics({ startDate, endDate } = {}) {
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [orders, refunds] = await Promise.all([
      Order.find(query).populate('items.product'),
      Refund.find(query)
    ]);

    const statistics = {
      totalRevenue: 0,
      orderStatusBreakdown: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        completed: 0
      },
      paymentStatusBreakdown: {
        paid: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
        partially_refunded: 0
      },
      refundStatistics: {
        totalRefunded: 0,
        numberOfRefundedOrders: 0,
      },
      totalItemsSold: 0,
      couponUsage: {},
      salesByCurrency: {},
      salesByProduct: {}
    };

    orders.forEach(order => {
      // Order status breakdown
      statistics.orderStatusBreakdown[order.orderStatus]++;
      
      // Payment status breakdown
      statistics.paymentStatusBreakdown[order.paymentStatus]++;
      
      // Revenue - only count paid and partially refunded orders
      if (['paid', 'partially_refunded'].includes(order.paymentStatus)) {
        statistics.totalRevenue += (order.finalTotal || 0);
      }
      
      // Currency breakdown - track all orders regardless of status
      if (order.finalTotal) {
        statistics.salesByCurrency[order.currency] = 
          (statistics.salesByCurrency[order.currency] || 0) + order.finalTotal;
      }
      
      // Items sold and product sales
      order.items.forEach(item => {
        statistics.totalItemsSold += item.quantity;
        if (item.product && item.product._id) {
          const productId = item.product._id.toString();
          const itemTotal = (item.price || 0) * item.quantity;
          statistics.salesByProduct[productId] = 
            (statistics.salesByProduct[productId] || 0) + itemTotal;
        }
      });

      // Coupon usage
      if (order.couponCode) {
        statistics.couponUsage[order.couponCode] = 
          (statistics.couponUsage[order.couponCode] || 0) + 1;
      }
    });

    // Refund statistics
    refunds.forEach(refund => {
      statistics.refundStatistics.totalRefunded += refund.amount || 0;
    });
    statistics.refundStatistics.numberOfRefundedOrders = 
      new Set(refunds.map(r => r.orderId.toString())).size;

    // Round all monetary values to 2 decimal places
    statistics.totalRevenue = Number(statistics.totalRevenue.toFixed(2));
    statistics.refundStatistics.totalRefunded = 
      Number(statistics.refundStatistics.totalRefunded.toFixed(2));
    
    Object.keys(statistics.salesByCurrency).forEach(currency => {
      statistics.salesByCurrency[currency] = 
        Number(statistics.salesByCurrency[currency].toFixed(2));
    });
    
    Object.keys(statistics.salesByProduct).forEach(productId => {
      statistics.salesByProduct[productId] = 
        Number(statistics.salesByProduct[productId].toFixed(2));
    });

    return statistics;
  }
};

module.exports = orderService;
