const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
// Comment out this line
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const shippingMethodService = require('./shippingMethodService');
const currencyService = require('./currencyService');
const { SUPPORTED_CURRENCIES } = require('../utils/orderConstants');
const Refund = require('../models/refundModel');

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
          price: item.price * exchangeRate
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
        paymentIntentId: dummyPaymentIntent.id // Use dummy ID
    });

    // Clear cart
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
    // For testing, accept any paymentIntentId that starts with 'pi_dummy_'
    const order = await Order.findOne({ 
      paymentIntentId: { 
        $regex: '^pi_dummy_' 
      } 
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
  
    // Update order status
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();
  
    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity }
      });
    }
  
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
      cancelled: []
    };

    if (!validTransitions[order.orderStatus].includes(status)) {
      throw new Error(`Invalid status transition from ${order.orderStatus} to ${status}`);
    }

    order.orderStatus = status;
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

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer'
    });

    // Create refund record
    const refundRecord = await Refund.create({
      orderId,
      userId: order.user,
      amount,
      reason,
      stripeRefundId: refund.id
    });

    // Update order status if fully refunded
    if (amount >= order.total) {
      order.orderStatus = 'cancelled';
      await order.save();
    }

    return refundRecord;
  }

};

module.exports = orderService;
