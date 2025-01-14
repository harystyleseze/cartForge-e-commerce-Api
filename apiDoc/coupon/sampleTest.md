# Coupon API Testing Guide

## Admin Endpoints (Requires Admin Token)

### 1. Create Coupon (POST /api/coupons)
```http
POST /api/coupons
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "SUMMER2024",
  "discountType": "percentage",
  "discountValue": 20,
  "validFrom": "2024-03-15",
  "validUntil": "2024-06-30",
  "minimumOrderValue": 50,
  "usageLimit": 100,
  "applicableCategories": ["65f1a2b3c4d5e6f7g8h9i0j1"],
  "customerRestrictions": {
    "newCustomersOnly": true,
    "vipOnly": false
  }
}
```

Expected Response (201 Created):
```json
{
  "status": "success",
  "data": {
    "coupon": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "code": "SUMMER2024",
      "discountType": "percentage",
      "discountValue": 20,
      "validFrom": "2024-03-15T00:00:00.000Z",
      "validUntil": "2024-06-30T23:59:59.999Z",
      "minimumOrderValue": 50,
      "usageLimit": 100,
      "usageCount": 0,
      "status": "active"
    }
  }
}
```

### 2. Get All Coupons (GET /api/coupons)
```http
GET /api/coupons?status=active&page=1&limit=10
Authorization: Bearer {admin_token}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "coupons": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "code": "SUMMER2024",
        "discountType": "percentage",
        "discountValue": 20,
        "status": "active"
      }
    ]
  }
}
```

### 3. Update Coupon (PATCH /api/coupons/:id)
```http
PATCH /api/coupons/65f1a2b3c4d5e6f7g8h9i0j2
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "discountValue": 25,
  "validUntil": "2024-07-31",
  "status": "inactive"
}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "coupon": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "code": "SUMMER2024",
      "discountValue": 25,
      "validUntil": "2024-07-31T23:59:59.999Z",
      "status": "inactive"
    }
  }
}
```

### 4. Delete Coupon (DELETE /api/coupons/:id)
```http
DELETE /api/coupons/65f1a2b3c4d5e6f7g8h9i0j2
Authorization: Bearer {admin_token}
```

Expected Response (204 No Content)

## User Endpoints (Requires User Token)

### 5. Validate Coupon (GET /api/coupons/validate/:code)
```http
GET /api/coupons/validate/SUMMER2024
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "cartTotal": 100,
  "categories": ["65f1a2b3c4d5e6f7g8h9i0j1"],
  "items": [
    {
      "productId": "65f1a2b3c4d5e6f7g8h9i0j3",
      "quantity": 2,
      "price": 50
    }
  ]
}
```

Expected Response (200 OK):
```json
{
  "status": "success",
  "data": {
    "coupon": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "code": "SUMMER2024",
      "discountType": "percentage",
      "discountValue": 20
    },
    "discount": 20 // 20% of 100
  }
}
```

### 6. Apply Coupon to Order (POST /api/orders)
```http
POST /api/orders
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "shippingMethodId": "674e5008af7772b1a60d01ff",
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
      "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "items": [...],
      "subtotal": 100,
      "shippingCost": 10,
      "couponCode": "SUMMER2024",
      "couponDiscount": 20,
      "finalTotal": 90,
      "orderStatus": "pending"
    },
    "clientSecret": "dummy_secret_123456789"
  }
}
```

## Error Responses

### Invalid Coupon
```json
{
  "status": "error",
  "message": "Invalid coupon code"
}
```

### Expired Coupon
```json
{
  "status": "error",
  "message": "Coupon has expired"
}
```

### Usage Limit Reached
```json
{
  "status": "error",
  "message": "Coupon usage limit has been reached"
}
```

### Minimum Order Value Not Met
```json
{
  "status": "error",
  "message": "Order must be at least $50 to use this coupon"
}
```

### Customer Restriction
```json
{
  "status": "error",
  "message": "This coupon is for new customers only"
}
```

### Category Restriction
```json
{
  "status": "error",
  "message": "Coupon is not valid for these products"
}
```
