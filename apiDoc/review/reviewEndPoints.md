
1. Create a Review (POST /api/reviews/product/:productId/reviews)
```json
// Request Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Request Body
{
  "rating": 4,
  "comment": "Great product! The quality exceeded my expectations."
}

// Expected Response (201 Created)
{
  "status": "success",
  "data": {
    "review": {
      "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
      "productId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d5",
        "name": "iPhone 14 Pro"
      },
      "userId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d6",
        "name": "John Doe"
      },
      "rating": 4,
      "comment": "Great product! The quality exceeded my expectations.",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

2. Get Review by ID (GET /api/reviews/:id)
```json
// No Request Body needed
// Response (200 OK)
{
  "status": "success",
  "data": {
    "review": {
      "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
      "productId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d5",
        "name": "iPhone 14 Pro"
      },
      "userId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d6",
        "name": "John Doe"
      },
      "rating": 4,
      "comment": "Great product! The quality exceeded my expectations.",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  }
}
```

3. Get User's Reviews (GET /api/reviews/product/:userId)
```json
// No Request Body needed
// Response (200 OK)
{
  "status": "success",
  "results": 2,
  "data": {
    "reviews": [
      {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
        "productId": {
          "_id": "65f4a2b8c7d8e9f0a1b2c3d5",
          "name": "iPhone 14 Pro"
        },
        "rating": 4,
        "comment": "Great product! The quality exceeded my expectations.",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z"
      },
      {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d7",
        "productId": {
          "_id": "65f4a2b8c7d8e9f0a1b2c3d8",
          "name": "MacBook Pro"
        },
        "rating": 5,
        "comment": "Amazing laptop! Perfect for my needs.",
        "createdAt": "2024-03-14T15:45:00.000Z",
        "updatedAt": "2024-03-14T15:45:00.000Z"
      }
    ]
  }
}
```

4. Get Product Reviews (GET /api/reviews/product/:productId/reviews)
```json
// No Request Body needed
// Response (200 OK)
{
  "status": "success",
  "results": 2,
  "data": {
    "reviews": [
      {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
        "userId": {
          "_id": "65f4a2b8c7d8e9f0a1b2c3d6",
          "name": "John Doe"
        },
        "rating": 4,
        "comment": "Great product! The quality exceeded my expectations.",
        "createdAt": "2024-03-15T10:30:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z"
      },
      {
        "_id": "65f4a2b8c7d8e9f0a1b2c3e0",
        "userId": {
          "_id": "65f4a2b8c7d8e9f0a1b2c3e1",
          "name": "Jane Smith"
        },
        "rating": 5,
        "comment": "Best purchase ever! Highly recommended.",
        "createdAt": "2024-03-15T11:20:00.000Z",
        "updatedAt": "2024-03-15T11:20:00.000Z"
      }
    ]
  }
}
```

5. Update Review (PUT /api/reviews/:id)
```json
// Request Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Request Body
{
  "rating": 5,
  "comment": "Updated review: Even better after using it for a while!"
}

// Response (200 OK)
{
  "status": "success",
  "data": {
    "review": {
      "_id": "65f4a2b8c7d8e9f0a1b2c3d4",
      "productId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d5",
        "name": "iPhone 14 Pro"
      },
      "userId": {
        "_id": "65f4a2b8c7d8e9f0a1b2c3d6",
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Updated review: Even better after using it for a while!",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T12:45:00.000Z"
    }
  }
}
```

6. Delete Review (DELETE /api/reviews/:id)
```json
// Request Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Response (204 No Content)
// No response body
```

7. Admin Delete Review (DELETE /api/reviews/admin/:id)
```json
// Request Headers
{
  "Authorization": "Bearer ADMIN_JWT_TOKEN"
}

// Response (204 No Content)
// No response body
```

Error Responses:
```json
// 400 Bad Request (e.g., duplicate review)
{
  "status": "error",
  "message": "You have already reviewed this product"
}

// 401 Unauthorized
{
  "status": "error",
  "message": "Please log in to access this resource"
}

// 403 Forbidden (for admin routes)
{
  "status": "error",
  "message": "Access denied. Admin only."
}

// 404 Not Found
{
  "status": "error",
  "message": "Review not found"
}
```

To use these in Postman:

1. Set up environment variables:
   - Create a variable called `BASE_URL` (e.g., `http://localhost:3000/api`)
   - Create a variable called `TOKEN` for your JWT token
   - Create a variable called `ADMIN_TOKEN` for admin JWT token

2. Create requests:
   - URL: `{{BASE_URL}}/reviews/...`
   - Headers: `Authorization: Bearer {{TOKEN}}` or `Bearer {{ADMIN_TOKEN}}`
   - Body: Raw, JSON format

3. For testing the routes that require a product ID or user ID, you'll need to:
   - First create a product and note its ID
   - Create a user and note its ID
   - Use these IDs in your review requests

Remember to replace placeholder IDs (like `65f4a2b8c7d8e9f0a1b2c3d4`) with actual IDs from your database when testing.
