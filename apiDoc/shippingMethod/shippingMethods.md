// Standard Shipping
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

// Express Shipping
{
  "name": "Express Shipping",
  "description": "Fast delivery within 2-3 business days",
  "price": 14.99,
  "deliveryTime": "2-3 business days",
  "type": "express",
  "isActive": true,
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 15,
    "minOrderAmount": 0,
    "allowedCountries": ["US", "CA"]
  }
}

// Free Shipping
{
  "name": "Free Shipping",
  "description": "Free shipping for orders over $100",
  "price": 0,
  "deliveryTime": "7-10 business days",
  "type": "free",
  "isActive": true,
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 10,
    "minOrderAmount": 100,
    "allowedCountries": ["US"]
  }
}

// International Shipping
{
  "name": "International Shipping",
  "description": "Worldwide delivery within 10-15 business days",
  "price": 29.99,
  "deliveryTime": "10-15 business days",
  "type": "international",
  "isActive": true,
  "restrictions": {
    "minWeight": 0,
    "maxWeight": 30,
    "minOrderAmount": 0,
    "allowedCountries": ["GB", "FR", "DE", "IT", "ES"]
  }
}