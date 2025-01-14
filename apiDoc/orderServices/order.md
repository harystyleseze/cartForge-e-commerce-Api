# Order API Testing Guide

## User Order Routes (Requires User Token)

### 1. Create Order (POST /api/orders)
```http
POST /api/orders
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "shippingMethodId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "US",
    "zipCode": "10001"
  },
  "currency": "USD",
  "couponCode": "SUMMER2024"
}
```

Expected Response (201 Created):
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "user": "65f1a2b3c4d5e6f7g8h9i0j3",
      "items": [
        {
          "product": "65f1a2b3c4d5e6f7g8h9i0j4",
          "quantity": 2,
          "price": 50
        }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "US",
        "zipCode": "10001"
      },
      "shippingMethod": "65f1a2b3c4d5e6f7g8h9i0j1",
      "shippingCost": 10,
      "subtotal": 100,
      "total": 110,
      "currency": "USD",
      "exchangeRate": 1,
      "subtotalInUSD": 100,
      "totalInUSD": 110,
      "paymentIntentId": "pi_dummy_1234567890",
      "paymentStatus": "pending",
      "paymentMethod": "card",
      "orderStatus": "pending",
      "couponCode": "SUMMER2024",
      "couponDiscount": 20,
      "finalTotal": 90,
      "refundStatus": "none",
      "refundedAmount": 0,
      "createdAt": "2024-03-15T10:00:00.000Z"
    },
    "clientSecret": "dummy_secret_1234567890"
  }
}
```

### 2. Confirm Order Payment (POST /api/orders/confirm)
```http
POST /api/orders/confirm
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "paymentIntentId": "pi_dummy_1234567890"
}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "paymentStatus": "paid",
      "orderStatus": "processing"
    }
  }
}
```

### 3. Get User Order (GET /api/orders/:id)
```http
GET /api/orders/65f1a2b3c4d5e6f7g8h9i0j2
Authorization: Bearer {user_token}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "items": [
        {
          "product": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
            "name": "Product Name",
            "price": 50
          },
          "quantity": 2,
          "price": 50
        }
      ],
      "shippingMethod": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Standard Shipping",
        "cost": 10
      },
      "orderStatus": "processing",
      "paymentStatus": "paid",
      "finalTotal": 90
    }
  }
}
```

GET /api/orders/statistics?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {user_token}

..............................................

## Admin Order Routes (Requires Admin Token)

### 1. Get All Orders (GET /api/admin/orders)
```http
GET /api/admin/orders?status=processing&page=1&limit=10
Authorization: Bearer {admin_token}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "orders": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "user": {
          "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
          "email": "user@example.com",
          "name": "John Doe"
        },
        "orderStatus": "processing",
        "paymentStatus": "paid",
        "finalTotal": 90,
        "createdAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

### 2. Update Order Status (PATCH /api/admin/orders/:orderId/status)
```http
PATCH /api/admin/orders/65f1a2b3c4d5e6f7g8h9i0j2/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped"
}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "orderStatus": "shipped",
      "paymentStatus": "paid"
    }
  }
}
```

### 3. Process Refund (POST /api/admin/orders/:orderId/refund)
```http
POST /api/admin/orders/65f1a2b3c4d5e6f7g8h9i0j2/refund
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "amount": 45,
  "reason": "partial_refund"
}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "refund": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "orderId": "65f1a2b3c4d5e6f7g8h9i0j2",
      "userId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "amount": 45,
      "reason": "partial_refund",
      "stripeRefundId": "re_dummy_1234567890",
      "createdAt": "2024-03-15T12:00:00.000Z"
    }
  }
}
```

GET /api/admin/orders/statistics?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {admin_token}

## Error Responses

### Invalid Order ID
```json
{
  "status": "error",
  "message": "Order not found"
}
```

### Invalid Status Transition
```json
{
  "status": "error",
  "message": "Invalid status transition from processing to completed"
}
```

### Payment Required
```json
{
  "status": "error",
  "message": "Cannot process order: payment not confirmed"
}
```

### Invalid Refund Amount
```json
{
  "status": "error",
  "message": "Refund amount exceeds refundable amount"
}
```

### Empty Cart
```json
{
  "status": "error",
  "message": "Cart is empty"
}
```

### Currency Not Supported
```json
{
  "status": "error",
  "message": "Currency not supported"
}
```