Update Product Image (PATCH /api/products/:id/image)

POST /api/products/:id/images
Content-Type: multipart/form-data
Form field name: images

// Headers
{
  "Authorization": "Bearer your_jwt_token",
  "Content-Type": "multipart/form-data"
}

// Form-data
{
  "image": "(file upload)"
}

// Expected Response (200)
{
  "status": "success",
  "data": {
    "product": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "image": "https://res.cloudinary.com/your-cloud/image/upload/products/macbook-new.jpg",
      "imagePublicId": "products/macbook-new",
      // ... other fields remain unchanged
    }
  }
}