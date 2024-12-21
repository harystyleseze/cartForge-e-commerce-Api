All endpoints and sample data:

### 1. Add Products to Cart
**Endpoint:** `POST /api/cart/add`
**Auth:** Required
```json
{
  "productId": "65f4a2b8c7d8e9f0a1b2c3d4",
  "quantity": 2
}
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "userId": "65f4a2b8c7d8e9f0a1b2c3d4",
      "items": [{
        "product": {
          "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
          "name": "Sample Product",
          "price": 99.99
        },
        "quantity": 2,
        "price": 99.99
      }],
      "totalAmount": 199.98,
      "totalQuantity": 2
    }
  }
}
```

### 2. View Cart
**Endpoint:** `GET /api/cart`
**Auth:** Required

The cart service implementation can be found here:

```1:49:services/cartService.js
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const cartService = {
  async getCart(userId) {
    let cart = await Cart.findOne({ userId })
      .populate('items.product', 'name price stockQuantity');
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    return cart;
  },

  async addToCart(userId, productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    return await cart.save();
  },
```


### 3. Get Available Shipping Methods
**Endpoint:** `GET /api/shipping-methods/available`
**Query Parameters:**
- weight (optional)
- totalAmount (optional)
- countryCode (optional)

Example: `/api/shipping-methods/available?weight=2&totalAmount=199.98&countryCode=US`

The shipping method service implementation:

```146:211:services/shippingMethodService.js
  async getAvailableShippingMethods(orderData) {
    const {
      totalAmount = 0,
      weight = 0,
      countryCode
    } = orderData;

    const region = getRegionForCountry(countryCode);
    
    const query = {
      isActive: true,
      'restrictions.minWeight': { $lte: weight },
      'restrictions.maxWeight': { $gte: weight },
      'restrictions.minOrderAmount': { $lte: totalAmount },
      $or: [
        { 'restrictions.allowedRegions': region },
        { 'restrictions.allowedCountries': countryCode }
      ]
    };

    // Add weight restrictions if weight is provided
    if (weight !== undefined) {
      query['restrictions.minWeight'] = { $lte: weight };
      query['restrictions.maxWeight'] = { $gte: weight };
    }

    // Add order amount restriction if totalAmount is provided
    if (totalAmount !== undefined) {
      query['restrictions.minOrderAmount'] = { $lte: totalAmount };
    }

    // Add region/country restrictions only if countryCode is provided
    if (countryCode) {
      const region = getRegionForCountry(countryCode);
      query.$or = [
        { 'restrictions.allowedRegions': region },
        { 'restrictions.allowedCountries': countryCode.toUpperCase() },
        { 'restrictions.allowedCountries': { $exists: true, $size: 0 } }, // Include methods with no country restrictions
        { 'restrictions.allowedCountries': { $exists: false } } // Include methods with no restrictions defined
      ];
    }
    const shippingMethods = await ShippingMethod.find(query);

    // Calculate costs for each available method
    const shippingMethodsWithCosts = await Promise.all(
      shippingMethods.map(async (method) => {
        try {
          const costDetails = await this.calculateShippingCost(
            method._id,
            orderData
          );
          
          return {
            ...method.toObject(),
            calculatedCost: costDetails
          };
        } catch (error) {
          return null;
        }
      })
    );

    // Filter out methods where cost calculation failed
    return shippingMethodsWithCosts.filter(method => method !== null);
  }
```


### 4. Calculate Shipping Cost
**Endpoint:** `GET /api/shipping-methods/:shippingMethodId/calculate`
**Query Parameters:**
- weight
- totalAmount
- countryCode

Example: `/api/shipping-methods/65f4a2b8c7d8e9f0a1b2c3d4/calculate?weight=2&totalAmount=199.98&countryCode=US`

### 5. Create Order
**Endpoint:** `POST /api/orders`
**Auth:** Required
```json
{
  "shippingMethodId": "65f4a2b8c7d8e9f0a1b2c3d4",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "US",
    "zipCode": "10001"
  },
  "currency": "USD"
}
```

The order creation logic:

```10:93:services/orderService.js
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
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      metadata: {
        userId: userId.toString(),
        orderItems: JSON.stringify(cart.items.map(item => ({
          productId: item.product._id.toString(),
          quantity: item.quantity
        })))
      }
    });

    // Create order
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
      paymentIntentId: paymentIntent.id
    });

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0, totalQuantity: 0 } }
    );

    return {
      order,
      clientSecret: paymentIntent.client_secret
    };
  },
```


### 6. Confirm Order Payment
**Endpoint:** `POST /api/orders/confirm`
**Auth:** Required
```json
{
  "paymentIntentId": "pi_3O9X4K2eZvKYlo2C1ghN9BbE"
}
```

### Complete Flow Test Data:

1. First, create a test product in your database:
```json
{
  "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
  "name": "Test Product",
  "price": 99.99,
  "weight": 1.5,
  "stockQuantity": 10
}
```

2. Create a test shipping method:
```json
{
  "_id": "65f4a2b8c7d8e9f0a1b2c3d5",
  "name": "Standard Shipping",
  "price": 9.99,
  "type": "standard",
  "isActive": true,
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 20,
    "minOrderAmount": 0
  },
  "regionPricing": [
    {
      "region": "domestic",
      "basePrice": 9.99,
      "pricePerKg": 1.00,
      "freeShippingThreshold": 150
    }
  ]
}
```

### Testing Flow with cURL Commands:

1. Add to Cart:
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65f4a2b8c7d8e9f0a1b2c3d4",
    "quantity": 2
  }'
```

2. Get Shipping Methods:
```bash
curl "http://localhost:3000/api/shipping-methods/available?weight=3&totalAmount=199.98&countryCode=US" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. Create Order:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingMethodId": "65f4a2b8c7d8e9f0a1b2c3d5",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "US",
      "zipCode": "10001"
    },
    "currency": "USD"
  }'
```

4. Confirm Payment (after handling Stripe payment on frontend):
```bash
curl -X POST http://localhost:3000/api/orders/confirm \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentIntentId": "pi_3O9X4K2eZvKYlo2C1ghN9BbE"
  }'
```

### Expected Flow Results:

1. After adding to cart:
- Cart should contain the items
- Total should be calculated correctly

2. After getting shipping methods:
- Should receive available shipping methods with calculated costs
- Free shipping should be applied if order meets threshold

3. After creating order:
- Order should be created in database
- Cart should be cleared
- Should receive Stripe payment intent client secret

4. After confirming payment:
- Order status should update to 'processing'
- Payment status should update to 'paid'
- Product stock should be reduced
- Order confirmation email should be sent (if implemented)

The webhook handling for Stripe events can be found in:

```54:84:server.js
app.use(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
app.use('*', (req, res) => {
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
// Add this line after your existing middleware
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          await orderService.confirmOrder(paymentIntent.id);
          break;
        // ... handle other event types if needed
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      res.json({ received: true });
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);
```