// POST /api/shipping-methods
{
  "name": "Standard Shipping",
  "description": "Regular delivery within 5-7 business days",
  "price": 9.99,
  "deliveryTime": "5-7 business days",
  "type": "standard",
  "isActive": true,
  "regionPricing": [
    {
      "region": "domestic",
      "basePrice": 9.99,
      "pricePerKg": 1.00,
      "freeShippingThreshold": 100
    },
    {
      "region": "north-america",
      "basePrice": 14.99,
      "pricePerKg": 1.50,
      "freeShippingThreshold": 150
    },
    {
      "region": "europe",
      "basePrice": 19.99,
      "pricePerKg": 2.00,
      "freeShippingThreshold": 200
    }
  ],
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 20,
    "minOrderAmount": 0,
    "allowedCountries": ["US", "CA", "GB", "FR", "DE"]
  }
}