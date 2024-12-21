Create Product (POST /api/products)

{
  "name": "iPhone 14 Pro",
  "description": "Latest iPhone with advanced camera system",
  "price": 999.99,
  "stockQuantity": 50,
  "category": "65f1a2b3c4d5e6f7g8h9i0j1",  // Replace with actual category ID
  "brand": "65f1a2b3c4d5e6f7g8h9i0j2",     // Replace with actual brand ID
  "tags": ["smartphone", "apple", "5G"],
  "featured": true
}

// Postman Collection

// Headers
{
  "Authorization": "Bearer your_jwt_token",
  "Content-Type": "multipart/form-data"
}

// Form-data
{
  "name": "MacBook Pro M2",
  "description": "Latest MacBook Pro with M2 chip and 16GB RAM",
  "price": 1499.99,
  "stockQuantity": 25,
  "category": "65f1a2b3c4d5e6f7g8h9i0j1",  // Replace with actual category ID
  "brand": "65f1a2b3c4d5e6f7g8h9i0j2",     // Replace with actual brand ID
  "tags": ["laptop", "apple", "m2"],
  "featured": true,
  "image": "(file upload)"
}

// Expected Response (201)
{
  "status": "success",
  "data": {
    "product": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "name": "MacBook Pro M2",
      "description": "Latest MacBook Pro with M2 chip and 16GB RAM",
      "price": 1499.99,
      "stockQuantity": 25,
      "image": "https://res.cloudinary.com/your-cloud/image/upload/products/macbook.jpg",
      "imagePublicId": "products/macbook",
      "category": "65f1a2b3c4d5e6f7g8h9i0j1",
      "brand": "65f1a2b3c4d5e6f7g8h9i0j2",
      "tags": ["laptop", "apple", "m2"],
      "featured": true,
      "averageRating": 0,
      "ratings": 0,
      "createdAt": "2024-03-13T10:00:00.000Z",
      "updatedAt": "2024-03-13T10:00:00.000Z"
    }
  }
}
