Get All Shipping Methods (GET /api/shipping-methods)

-----------------------------------

Get Single Shipping Method (GET /api/shipping-methods/:id)
// GET http://localhost:3000/api/shipping-methods/shipping_method_id

------------------------------------

Update Shipping Method (PUT /api/shipping-methods/:id)

// PUT http://localhost:3000/api/shipping-methods/shipping_method_id
// Headers:
{
  "Authorization": "Bearer YOUR_ADMIN_JWT_TOKEN",
  "Content-Type": "application/json"
}

// Request Body:
{
  "price": 12.99,
  "deliveryTime": "4-6 business days",
  "restrictions": {
    "minOrderAmount": 25
  }
}


--------------------------------------

Delete Shipping Method (DELETE /api/shipping-methods/:id)
// DELETE http://localhost:3000/api/shipping-methods/shipping_method_id
// Headers:
{
  "Authorization": "Bearer YOUR_ADMIN_JWT_TOKEN"
}

--------------------------------------

Get Available Shipping Methods (GET /api/shipping-methods/available)

----------------------------------

Get only active shipping methods

GET http://localhost:3000/api/shipping-methods?isActive=true


----------------------------------

Get inactive shipping methods
GET http://localhost:3000/api/shipping-methods?isActive=false


----------------------------------

Additional filters
GET http://localhost:3000/api/shipping-methods?type=express&maxPrice=20&minPrice=5

----------------------------------
All parameter
GET /api/shipping-methods/available?weight=5&totalAmount=100&countryCode=US

----------------------------------

without country code
GET /api/shipping-methods/available?weight=5&totalAmount=100

----------------------------------

With minimal parameter

GET /api/shipping-methods/available
