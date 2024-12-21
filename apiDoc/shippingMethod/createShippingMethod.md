Create Shipping Method (POST /api/shipping-methods)

// POST http://localhost:3000/api/shipping-methods
// Headers:
{
  "Authorization": "Bearer YOUR_ADMIN_JWT_TOKEN",
  "Content-Type": "application/json"
}

// Request Body:
{
  "name": "Standard Shipping",
  "description": "Regular delivery within 5-7 business days",
  "price": 9.99,
  "deliveryTime": "5-7 business days",
  "type": "standard",
  "isActive": true,
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 20,
    "minOrderAmount": 0,
    "allowedCountries": ["US", "CA"]
  }
}
