Get All Products (GET /api/products)

/api/products?category=65f1a2b3c4d5e6f7g8h9i0j1
/api/products?brand=65f1a2b3c4d5e6f7g8h9i0j2
/api/products?search=iPhone
/api/products?minPrice=500&maxPrice=1000
/api/products?sort=-price

// Postman Collection

// Sample Query Parameters
/api/products                                    // Get all products
/api/products?category=65f1a2b3c4d5e6f7g8h9i0j1 // Filter by category
/api/products?brand=65f1a2b3c4d5e6f7g8h9i0j2    // Filter by brand
/api/products?search=MacBook                     // Search products
/api/products?minPrice=1000&maxPrice=2000        // Price range
/api/products?sort=-price                        // Sort by price descending

// Expected Response (200)
{
  "status": "success",
  "results": 1,
  "data": {
    "products": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
        "name": "MacBook Pro M2",
        "description": "Latest MacBook Pro with M2 chip and 16GB RAM",
        "price": 1499.99,
        "stockQuantity": 25,
        "image": "https://res.cloudinary.com/your-cloud/image/upload/products/macbook.jpg",
        "category": {
          "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
          "name": "Laptops"
        },
        "brand": {
          "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Apple"
        },
        "tags": ["laptop", "apple", "m2"],
        "featured": true,
        "averageRating": 0,
        "ratings": 0
      }
    ]
  }
}
