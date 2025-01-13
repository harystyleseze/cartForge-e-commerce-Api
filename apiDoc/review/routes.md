### 1. **GET Reviews for a Product** (`GET /api/reviews/product/:productId/reviews`)

This route retrieves all reviews for a specific product.

#### Request:
```http
GET /api/reviews/product/60c72b2f9b1d8a38d8f2c3b9/reviews
```

#### Sample Response:
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "reviews": [
      {
        "_id": "60c72b2f9b1d8a38d8f2c3ba",
        "productId": "60c72b2f9b1d8a38d8f2c3b9",
        "userId": "60c72b9f9b1d8a38d8f2c3b8",
        "rating": 4,
        "comment": "Great product! Loved the quality.",
        "createdAt": "2025-01-01T10:00:00.000Z",
        "updatedAt": "2025-01-01T10:00:00.000Z"
      },
      {
        "_id": "60c72b2f9b1d8a38d8f2c3bb",
        "productId": "60c72b2f9b1d8a38d8f2c3b9",
        "userId": "60c72b9f9b1d8a38d8f2c3b7",
        "rating": 5,
        "comment": "Absolutely amazing! Exceeded my expectations.",
        "createdAt": "2025-01-02T15:30:00.000Z",
        "updatedAt": "2025-01-02T15:30:00.000Z"
      }
    ]
  }
}
```

### 2. **GET a Specific Review by ID** (`GET /api/reviews/:id`)

This route retrieves a specific review by its ID.

#### Request:
```http
GET /api/reviews/60c72b2f9b1d8a38d8f2c3ba
```

#### Sample Response:
```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60c72b2f9b1d8a38d8f2c3ba",
      "productId": "60c72b2f9b1d8a38d8f2c3b9",
      "userId": "60c72b9f9b1d8a38d8f2c3b8",
      "rating": 4,
      "comment": "Great product! Loved the quality.",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  }
}
```

### 3. **Create a Review** (`POST /api/reviews/product/:productId/reviews`)

This route allows an authenticated user to create a review for a product.

#### Request:
```http
POST /api/reviews/product/60c72b2f9b1d8a38d8f2c3b9/reviews
```

#### Request Body:
```json
{
  "rating": 5,
  "comment": "This product is outstanding! Very happy with my purchase."
}
```

#### Sample Response:
```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60c72b2f9b1d8a38d8f2c3bd",
      "productId": "60c72b2f9b1d8a38d8f2c3b9",
      "userId": "60c72b9f9b1d8a38d8f2c3b8",
      "rating": 5,
      "comment": "This product is outstanding! Very happy with my purchase.",
      "createdAt": "2025-01-03T10:00:00.000Z",
      "updatedAt": "2025-01-03T10:00:00.000Z"
    }
  }
}
```

### 4. **Update a Review** (`PUT /api/reviews/:id`)

This route allows an authenticated user to update their review by ID.

#### Request:
```http
PUT /api/reviews/60c72b2f9b1d8a38d8f2c3ba
```

#### Request Body:
```json
{
  "rating": 4,
  "comment": "Updated review: Still a great product, but there is some room for improvement."
}
```

#### Sample Response:
```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60c72b2f9b1d8a38d8f2c3ba",
      "productId": "60c72b2f9b1d8a38d8f2c3b9",
      "userId": "60c72b9f9b1d8a38d8f2c3b8",
      "rating": 4,
      "comment": "Updated review: Still a great product, but there is some room for improvement.",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-03T10:00:00.000Z"
    }
  }
}
```

### 5. **Delete a Review** (`DELETE /api/reviews/:id`)

This route allows an authenticated user to delete their review by ID.

#### Request:
```http
DELETE /api/reviews/60c72b2f9b1d8a38d8f2c3ba
```

#### Sample Response:
```json
{
  "status": "success",
  "data": null
}
```