# Calculate Discount Test Cases

First, create these test coupons:

````http
POST /api/coupons
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "PERCENT20",
  "discountType": "percentage",
  "discountValue": 20,
  "validFrom": "2024-03-15",
  "validUntil": "2024-12-31",
  "minimumOrderValue": 50
}
````

````http
POST /api/coupons
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "code": "BUY2GET1FREE",
  "discountType": "buyXgetY",
  "buyXgetY": {
    "buyQuantity": 2,
    "getQuantity": 1
  },
  "validFrom": "2024-03-15",
  "validUntil": "2024-12-31",
  "minimumOrderValue": 100
}
````

1. For Percentage Discount:

````http
POST /api/coupons/validate/PERCENT20
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "cartTotal": 100,
  "categories": ["674e40be4c38a1ce88e4ad55"],
  "items": [
    {
      "productId": "674e40be4c38a1ce88e4ad56",
      "quantity": 2,
      "price": 50
    }
  ]
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "coupon": {
      "code": "PERCENT20",
      "discountType": "percentage",
      "discountValue": 20
    },
    "discount": 20,  // 20% of 100
    "finalTotal": 80
  }
}
````

2. For Fixed Amount Discount:

````http
POST /api/coupons/validate/FIXED10
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "cartTotal": 100,
  "categories": ["674e40be4c38a1ce88e4ad55"],
  "items": [
    {
      "productId": "674e40be4c38a1ce88e4ad56",
      "quantity": 1,
      "price": 100
    }
  ]
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "coupon": {
      "code": "FIXED10",
      "discountType": "fixed",
      "discountValue": 10
    },
    "discount": 10,
    "finalTotal": 90
  }
}
````

3. For Buy X Get Y Free:

````http
POST /api/coupons/validate/BUY2GET1FREE
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "cartTotal": 150,
  "categories": ["674e40be4c38a1ce88e4ad55"],
  "items": [
    {
      "productId": "674e40be4c38a1ce88e4ad56",
      "quantity": 3,
      "price": 50
    }
  ]
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "coupon": {
      "code": "BUY2GET1",
      "discountType": "buyXgetY",
      "discountValue": 0,
      "buyXgetY": {
        "buyQuantity": 2,
        "getQuantity": 1
      }
    },
    "discount": 50,  // Price of 1 free item
    "finalTotal": 100
  }
}
````

4. For Free Shipping:

````http
POST /api/coupons/validate/FREESHIP
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "cartTotal": 200,
  "categories": ["674e40be4c38a1ce88e4ad55"],
  "items": [
    {
      "productId": "674e40be4c38a1ce88e4ad56",
      "quantity": 2,
      "price": 100
    }
  ]
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "coupon": {
      "code": "FREESHIP",
      "discountType": "freeShipping",
      "discountValue": 0
    },
    "discount": 0,  // Shipping discount is handled in order creation
    "finalTotal": 200
  }
}
````


Then test the complete order flow with a coupon:

````http
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
  "couponCode": "PERCENT20"
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "order": {
      "items": [...],
      "subtotal": 100,
      "shippingCost": 10,
      "couponCode": "PERCENT20",
      "couponDiscount": 20,
      "finalTotal": 90,
      "orderStatus": "pending"
    },
    "clientSecret": "dummy_secret_123456789"
  }
}

