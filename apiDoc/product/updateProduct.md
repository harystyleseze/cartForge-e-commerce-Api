Update Product (PUT /api/products/:id)

{
  "name": "iPhone 14 Pro Max",
  "price": 1099.99,
  "stockQuantity": 45,
  "description": "Updated description for iPhone 14 Pro Max",
  "tags": ["smartphone", "apple", "5G", "pro"]
}

// Postman Collection

// Headers
{
  "Authorization": "Bearer your_jwt_token",
  "Content-Type": "application/json"
}

// Request Body
{
  "name": "MacBook Pro M2 Pro",
  "price": 1699.99,
  "stockQuantity": 20,
  "description": "Updated MacBook Pro with M2 Pro chip and 32GB RAM",
  "tags": ["laptop", "apple", "m2", "pro"]
}

// Expected Response (200)
{
  "status": "success",
  "data": {
    "product": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "name": "MacBook Pro M2 Pro",
      "price": 1699.99,
      "stockQuantity": 20,
      "description": "Updated MacBook Pro with M2 Pro chip and 32GB RAM",
      "tags": ["laptop", "apple", "m2", "pro"],
      // ... other fields remain unchanged
    }
  }
}
