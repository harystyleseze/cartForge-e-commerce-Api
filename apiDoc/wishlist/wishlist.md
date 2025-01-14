# Wishlist Endpoints Documentation

1. **Add to Wishlist (POST /api/wishlist)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json"
}

// Request Body
{
    "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "note": "Birthday gift idea" // Optional
}

// Success Response (201)
{
    "status": "success",
    "data": {
        "wishlist": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
            "userId": "65f1a2b3c4d5e6f7g8h9i0j3",
            "items": [
                {
                    "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
                    "price": 99.99,
                    "note": "Birthday gift idea",
                    "addedAt": "2024-03-15T10:30:00.000Z",
                    "_id": "65f1a2b3c4d5e6f7g8h9i0j4"
                }
            ],
            "shareableLink": null,
            "shareLinkExpiry": null,
            "createdAt": "2024-03-15T10:30:00.000Z",
            "updatedAt": "2024-03-15T10:30:00.000Z"
        }
    }
}

// Error Response (400) - Product Already in Wishlist
{
    "status": "error",
    "message": "Product already in wishlist"
}
```

2. **Get Wishlist (GET /api/wishlist)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Query Parameters (optional)
// ?page=1&limit=20

// Success Response (200)
{
    "status": "success",
    "data": {
        "items": [
            {
                "productId": {
                    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
                    "name": "iPhone 14 Pro",
                    "price": 999.99,
                    "description": "Latest iPhone model",
                    "stockQuantity": 50
                },
                "price": 999.99,
                "note": "Birthday gift idea",
                "addedAt": "2024-03-15T10:30:00.000Z",
                "_id": "65f1a2b3c4d5e6f7g8h9i0j4"
            }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
    }
}
```

3. **Remove from Wishlist (DELETE /api/wishlist/:productId)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// URL
// DELETE /api/wishlist/65f1a2b3c4d5e6f7g8h9i0j1

// Success Response (200)
{
    "status": "success",
    "data": {
        "wishlist": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
            "userId": "65f1a2b3c4d5e6f7g8h9i0j3",
            "items": [],
            "shareableLink": null,
            "shareLinkExpiry": null,
            "updatedAt": "2024-03-15T10:35:00.000Z"
        }
    }
}
```

4. **Update Wishlist Item Note (PATCH /api/wishlist/:productId)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json"
}

// Request Body
{
    "note": "Maybe for Christmas instead"
}

// Success Response (200)
{
    "status": "success",
    "data": {
        "wishlist": {
            "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
            "items": [
                {
                    "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
                    "price": 999.99,
                    "note": "Maybe for Christmas instead",
                    "addedAt": "2024-03-15T10:30:00.000Z"
                }
            ]
        }
    }
}
```

5. **Get Notifications (GET /api/wishlist/notifications)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Success Response (200)
{
    "status": "success",
    "data": {
        "notifications": [
            {
                "type": "PRICE_DROP",
                "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
                "productName": "iPhone 14 Pro",
                "oldPrice": 999.99,
                "newPrice": 899.99,
                "difference": 100,
                "timestamp": "2024-03-15T10:40:00.000Z"
            },
            {
                "type": "OUT_OF_STOCK",
                "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
                "productName": "iPhone 14 Pro",
                "timestamp": "2024-03-15T10:40:00.000Z"
            }
        ]
    }
}
```

6. **Generate Shareable Link (POST /api/wishlist/share)**
```json
// Request Headers
{
"Authorization": "Bearer YOUR_JWT_TOKEN"
}
// Success Response (200)
{
"status": "success",
"data": {
"shareableLink": "http://yourdomain.com/wishlist/share/65f1a2b3c4d5e6f7g8h9i0j5",
"expiryDate": "2024-04-14T10:30:00.000Z"
}
}
```

7. **Get Wishlist by Shareable Link (GET /api/wishlist/share/:linkId)**
```json
// No Headers Required (Public Route)

// URL
// GET /api/wishlist/share/65f1a2b3c4d5e6f7g8h9i0j5

// Success Response (200)
{
    "status": "success",
    "data": {
        "wishlist": {
            "items": [
                {
                    "productId": {
                        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
                        "name": "iPhone 14 Pro",
                        "price": 999.99,
                        "description": "Latest iPhone model",
                        "images": ["url1", "url2"],
                        "stockQuantity": 50
                    },
                    "price": 999.99,
                    "note": "Birthday gift idea",
                    "addedAt": "2024-03-15T10:30:00.000Z"
                }
            ]
        }
    }
}

// Error Response (400) - Invalid or Expired Link
{
    "status": "error",
    "message": "Wishlist not found or link expired"
}
```

8. **Clear Expired Links (DELETE /api/wishlist/share/expired)**
```json
// Request Headers
{
    "Authorization": "Bearer YOUR_JWT_TOKEN"
}

// Success Response (200)
{
    "status": "success",
    "data": {
        "message": "Expired links cleared successfully",
        "clearedCount": 5
    }
}

**Common Error Responses:**

1. Authentication Error (401)
```json
{
    "status": "error",
    "message": "Please log in to access this resource"
}
```

2. Invalid ObjectId (400)
```json
{
    "status": "error",
    "message": "Invalid productId"
}
```

3. Product Not Found (400)
```json
{
    "status": "error",
    "message": "Product not found"
}
```

4. Note Too Long (400)
```json
{
    "status": "error",
    "message": "Note cannot exceed 500 characters"
}
```