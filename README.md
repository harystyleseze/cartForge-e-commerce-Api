# CartForge E-Commerce API

## Overview
CartForge is a backend API for an e-commerce platform, built using Node.js, Express, and MongoDB. It provides essential functionality for managing products, orders, users, shopping carts, and more. The API also supports authentication and role-based access control, allowing for both regular user and admin functionalities.

## Features
- **User Authentication**: Register and login with JWT token-based authentication.
- **Product Management**: Add, update, delete, and fetch products with images.
- **Order Management**: Create and track orders, manage order status.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Coupon System**: Create and validate discount codes.
- **Admin Controls**: Role-based access for admins to manage users, products, and orders.

## Technologies
- **Node.js**: JavaScript runtime for the server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store users, products, orders, etc.
- **JWT (JSON Web Token)**: Secure authentication for users.
- **Multer**: Middleware to handle file uploads for product images.
- **Cloudinary**: Cloud storage service for storing images.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure Node.js is installed. You can download it from [here](https://nodejs.org/).
- **MongoDB**: MongoDB must be installed and running, or use MongoDB Atlas for cloud-hosted databases.
- **Cloudinary**: It is used for image uploads, create an account and set up your credentials.

### Install Dependencies
Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/harystyleseze/cartForge-e-commerce-Api.git
cd cartForge-e-commerce-Api
```

Install the required dependencies:

```bash
npm install
```

### Configuration
1. Create a `.env` file in the root directory of the project. Chesck out the `.env.example` file to see the proper structure.
2. Add the following environment variables (replace with your own values):

```bash
MONGODB_URI=your_mongodb_connection_url
PORT=3000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For testing purposes, if you are using **MongoDB Atlas** for the cloud database, you will find the connection string in your MongoDB Atlas dashboard.

### Start the Server
Once everything is set up, start the server using:

```bash
npm start
```

This will run the server using `server.js`, and the API will be available on `http://localhost:3000`.

### Testing
Use [Postman](https://www.postman.com/) to test the API endpoints. Ensure you have a valid JWT token for protected routes.

Example: To test a protected route:

1. Register a new user via the `/api/auth/register` route.
2. Log in to get the JWT token via `/api/auth/login`.
3. Add the token to the **Authorization** header when making requests to protected routes like `/api/products`.

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login to get JWT token.

### Users
- **GET** `/api/users/profile`: Get logged-in user's profile.
- **PUT** `/api/users/profile`: Update logged-in user's profile.
- **DELETE** `/api/users/:id`: Delete a user (Admin only).

### Products
- **GET** `/api/products`: Get all products.
- **GET** `/api/products/:id`: Get a product by ID.
- **POST** `/api/products`: Create a new product (Admin only).
- **PUT** `/api/products/:id`: Update product by ID (Admin only).
- **DELETE** `/api/products/:id`: Delete a product by ID (Admin only).

### Cart
- **GET** `/api/cart`: Get the current user's cart.
- **POST** `/api/cart/add`: Add an item to the cart.
- **PUT** `/api/cart/update`: Update an item in the cart.
- **DELETE** `/api/cart/remove/:productId`: Remove an item from the cart.
- **DELETE** `/api/cart/clear`: Clear the cart.

### Orders
- **POST** `/api/orders`: Create a new order.
- **GET** `/api/orders`: Get all orders for the current user.
- **GET** `/api/orders/:id`: Get details of a specific order.
- **POST** `/api/orders/confirm`: Confirm an order.
  
### Admin Routes
- **GET** `/api/admin/orders`: Get all orders (Admin only).
- **PATCH** `/api/admin/orders/:orderId/status`: Update the order status (Admin only).

### Reviews
- **POST** `/api/reviews/product/:productId/reviews`: Create a review for a product.
- **GET** `/api/reviews/product/:productId/reviews`: Get all reviews for a product.
- **PUT** `/api/reviews/:id`: Update a review by ID.
- **DELETE** `/api/reviews/:id`: Delete a review by ID (Admin only).

## Usage Guidelines

- The API is intended for use in building the backend for an e-commerce platform.
- Use JWT for user authentication and authorization. Make sure to include the token in the `Authorization` header for protected routes.
- Admin users can access routes marked as "Admin only" and perform actions like managing products, orders, and users.

## Error Handling
- All errors will be returned with a JSON response containing the error message and status code.
  Example:
  ```json
  {
    "status": "error",
    "message": "Product not found"
  }
  ```

## Next Steps

1. **Frontend Development**: Implement the frontend for the e-commerce platform that interacts with this API.
2. **Payment Integration**: Integrate payment services like **Stripe** webhook for processing payments. It is currently disabled and a dummy data was used to simulate the testing.
3. **Testing**: Write unit and integration tests for the API routes and functions. I have written for some routes.


## Conclusion

The CartForge E-Commerce API provides a robust backend solution for an e-commerce platform, enabling secure user authentication, product management, and order processing. Future improvements will include frontend development and additional optimizations.