Get Cart (GET /api/cart)
// Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

Add to Cart (POST /api/cart/add)
// Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

// Request Body
{
  "productId": "65f1a2b3c4d5e6f7g8h9i0j5",
  "quantity": 2
}