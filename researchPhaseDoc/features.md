### 1. **User Model**  
**Key Features:**
- **Authentication & Authorization:**
  - Register a new user with validation for unique email and password complexity.
  - Login and generate authentication tokens (JWT or session-based).
  - Role-based access control (User, Admin).
  
- **Profile Management:**
  - Update user profile (e.g., first name, last name, phone, etc).
  - Add, update, or remove multiple shipping addresses.
  
- **Order and Wishlist Management:**
  - View order history and past purchases.
  - Add, remove, and manage products in the wishlist.
  
- **Cart Management:**
  - Associate one active cart with a user.
  - Manage cart items (add, update, remove products).

- **API Endpoints:**
  - `POST /register`, `POST /login`, `PUT /user/:id`, `GET /user/:id/orders`

---

### 2. **Product Model** 
**Key Features:**
- **Product Management:**
  - Add new products, update product details (e.g., name, description, price, featured, review, average rating, number of reviews).
  - Manage stock quantity (automatically update stock on purchase).
  
- **Product Filtering and Searching:**
  - Filter products by category, brand, or tags.
  - Search for products based on name or description.

- **Product Review:**
  - Allow users to rate and review products.
  
- **API Endpoints:**
  - `POST /products`, `PUT /products/:id`, `GET /products/:id`, `GET /products?category=:categoryId`,`GET /products/:productid`

---

### 3. **Category Model**  
**Key Features:**
- **Category Management:**
  - Add and manage categories.
  - Create, update, and delete product categories.
  - Categorize products into relevant groups.

- **API Endpoints:**
  - `POST /categories`, `GET /categories`, etc

---

### 4. **Brand Model**  
**Key Features:**
- **Brand Management:**
  - Add and manage product brands.
  - Create, update, and delete product brands
  - Associate products with a specific brand.

- **API Endpoints:**
  - `POST /brands`, `GET /brands`, etc

---

### 5. **Cart Model**  
**Key Features:**
- **Cart Management:**
  - Add, remove, and update product quantities in the cart.
  - Track the total value, price, and quantity of products in the cart.

- **API Endpoints:**
  - `GET /cart/:userId`, `POST /cart/:userId/add`

---

### 6. **Shipping Method Model**  
**Key Features:**
- **Shipping Method Management:**
  - Add and manage different shipping methods (e.g., standard shipping, expedited shipping, next-day/same-day shipping, international shipping, free shipping, flat rate shipping, local delivery/in-store pickup, courier/same-day local courier, drop shipping, ship-to-store, subscription or scheduled shipping, and white-glove delivery ).
  - Define or add delivery time and cost for each shipping method.
  
- **API Endpoints:**
  - `POST /shipping-methods`, `GET /shipping-methods`

---

### 7. **Coupon Model**  
**Key Features:**
- **Coupon Code Validation:**
  - Validate coupon codes during checkout.
  - Ensure the coupon is active, not expired, and meets minimum order requirements.
  
- **Discount Application:**
  - Apply a discount to the order total, either as a fixed amount or percentage.

- **API Endpoints:**
  - `POST /coupons`, `GET /coupons/:code`

---

### 6. **Payment Model**  
**Key Features:**
- **Payment Processing:**
  - Process payments for orders using various payment methods (credit card, PayPal).
  
- **Transaction Management:**
  - Handle payment status (pending, completed, failed).
  - Track payment transactions via transaction ID.

- **API Endpoints:**
  - `POST /payment/:orderId`, `GET /payment/:transactionId`

---

### 7. **Review Model**  
**Key Features:**
The review system includes features like:
Preventing duplicate reviews from the same user
Automatic calculation of average ratings
Proper population of user and product data in responses
Authorization checks for update/delete operations
Admin privileges for review management
- **Product Reviews:**
  - Allow users to rate and leave feedback on products they’ve purchased.
  - Manage reviews for products (edit or delete).

- **API Endpoints:**
  - `POST /reviews`, `PUT /reviews/:id`, `GET /reviews/:productId`, etc

---

### 8. **Order Model**  
**Key Features:**
- **Order Management:**
  - Place an order based on products in the cart.
  - Calculate total order amount (product prices, discounts, shipping costs).
  - Track the status of the order (e.g., new, shipped, delivered, canceled).
  
- **Order History:**
  - View past orders associated with the user.
  
- **API Endpoints:**
  - `POST /orders`, `GET /orders/:id`, etc

---


### 10. **Wishlist Model**  
**Key Features:**
- **Wishlist Management:**
  - Allow users to save products for future purchases.
  - Add, view, and remove products from the wishlist.




### **API Endpoints Overview**

1. **POST /wishlist**: 
   - Adds an item to the user's wishlist.
   - User is required to be authenticated (authMiddleware).

2. **DELETE /wishlist/:productId**:
   - Removes a specific product from the user's wishlist.
   - The `productId` is passed as a parameter in the URL.

3. **GET /wishlist**:
   - Retrieves the user's entire wishlist.
   - User authentication is required to access their wishlist.

4. **PATCH /wishlist/:productId**:
   - Updates the details of an existing item in the wishlist (e.g., quantity, price, image, etc.).
   - The `productId` is used to identify the item in the wishlist.

5. **GET /wishlist/notifications**:
   - Retrieves notifications such as price drops or stock alerts for items in the user's wishlist.
   - Can be used to send alerts based on the wishlist's item status (e.g., out of stock or price changes).

6. **POST /wishlist/share**: 
   - Generates a shareable link for the user's wishlist.
   - The link can be shared with others or used for public access to the wishlist.

7. **GET /wishlist/:linkId**:
   - Allows someone to access a wishlist via a shareable link (i.e., a public wishlist). 
   - The `linkId` corresponds to a unique identifier for the shareable wishlist link.

### **Route Mapping with Authentication**

- **Authentication Middleware** (`authMiddleware`): This ensures that the user is logged in before accessing their private wishlist data. For actions like adding/removing items, updating the wishlist, and generating shareable links, users must be authenticated.
  
- **Shareable Link**: The route `/wishlist/share` will generate a unique shareable link for the user's wishlist, and `/wishlist/:linkId` allows anyone with that link to view the wishlist (assuming it’s public).

### **Considerations**: 

1. **Error Handling**: For all routes, ensure that you have appropriate error handling for cases such as: 
   - Wishlist not found.
   - Item not found in the wishlist.
   - Invalid product ID.

2. **Shareable Link Expiry** : Consider adding an expiry time for the shareable link (e.g., the link expires in 30 days) to prevent infinite access. This can be added to the `Wishlist` schema with a `sharedLinkExpiry` field. 

4. **Pagination/Filtering**: For large wishlists, consider adding pagination or filters to the `GET /wishlist` endpoint to avoid loading too many items at once. For example, limit the number of items returned in a single request and provide query parameters to control this (e.g., `GET /wishlist?page=1&limit=20`)

---

### **Additional Features/Functions for the System:**

1. **Search Functionality:**
   - Allow users to search for products by name, category, or other attributes (tags, brand, etc.).

2. **Order Checkout Flow:**
   - Validate cart before proceeding to checkout (ensure stock availability, apply discounts, etc.).
   - Offer multiple payment methods (credit card, PayPal, etc.).
   - Calculate shipping costs based on selected shipping method.

3. **Admin Dashboard Features:**
   - Admin users can manage products, categories, brands, and view all orders.
   - View and update order statuses, process payments, and issue refunds.

4. **Notification System:**
   - Send notifications to users regarding order status updates, payment confirmations, or shipping updates.

5. **Security Features:**
   - Hash passwords using strong encryption (e.g., bcrypt).
   - Implement JWT for secure, stateless authentication.
   - Implement rate-limiting and other security best practices (e.g., for login attempts).

---

### **Admin-Specific Features:**
- **Product and Order Management:**
  - Add, edit, and remove products and categories.
  - View and manage all orders.
  - Mark orders as completed or canceled.

- **Reports:**
  - Generate sales, user activity, and order reports for better decision-making.

## Wishlist Features

The application includes a comprehensive wishlist system that allows users to:

1. Add products to their wishlist
2. Remove products from their wishlist
3. View their wishlist with pagination support
4. Update wishlist items
5. Receive notifications for price drops and stock changes
6. Generate shareable links for their wishlist
7. Access public wishlists through shareable links

### API Endpoints

- `POST /wishlist`: Add a product to wishlist
- `DELETE /wishlist/:productId`: Remove a product from wishlist
- `GET /wishlist`: View wishlist (with pagination)
- `PATCH /wishlist/:productId`: Update wishlist item
- `GET /wishlist/notifications`: Get notifications for wishlist items
- `POST /wishlist/share`: Generate a shareable link
- `GET /wishlist/:linkId`: Access a wishlist via shareable link

### Security Features

- All private wishlist operations require authentication
- Shareable links expire after 30 days
- Rate limiting on API endpoints
- Input validation for all endpoints
