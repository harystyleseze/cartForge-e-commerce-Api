### 1. **User Model**
**Key Attributes:**
- `username`: String, unique, required
- `email`: String, unique, required
- `password`: String, required (hashed)
- `firstName`: String, required
- `lastName`: String, required
- `address`: [Object] (Array of address objects with fields like street, city, zip, country)
- `phone`: String, optional
- `role`: String, required (e.g., 'user', 'admin', 'merchant')
- `isActive`: Boolean, default `true`
- `createdAt`: Date, default to the current timestamp
- `updatedAt`: Date, updated when user information is modified
- `orderHistory`: [ObjectId] (Array of references to the `Order` model, showing past orders)
- `wishlist`: [ObjectId] (Array of references to the `Wishlist` model)
- `cart`: [ObjectId] (Reference to the `Cart` model)

**Relationships:**
- One-to-many: One user can have multiple orders, wishlists, and addresses.
- One-to-one: Each user has one cart.

**Methods/Actions:**
- Register, login, and authenticate.
- Add and update user profile information.
- Add shipping addresses.
- Add products to the cart or wishlist.

**Validation Rules:**
- `email`: Must be unique.
- `password`: Should meet complexity requirements (e.g., minimum length, special characters).

**API Endpoints:**
- POST `/register` (for registration)
- POST `/login` (for authentication)
- PUT `/user/:id` (for updating user info)
- GET `/user/:id/orders` (get order history)

---

### 2. **Product Model**
**Key Attributes:**
- `name`: String, required
- `description`: String, required
- `price`: Number (float), required
- `stockQuantity`: Number, required
- `image`: String, optional (URL or file path)
- `category`: ObjectId (reference to the `Category` model), required
- `brand`: ObjectId (reference to the `Brand` model), required
- `tags`: [String], optional
- `ratings`: Number, optional (average rating)
- `createdAt`: Date, default to the current timestamp
- `updatedAt`: Date, updated when product info is modified

**Relationships:**
- One-to-many: A product belongs to one category and one brand, but can be reviewed by many users.

**Methods/Actions:**
- Add a product to inventory.
- Update product details.
- Manage product stock (e.g., decrement stock when an order is placed).

**Validation Rules:**
- `price`: Should be greater than zero.
- `stockQuantity`: Should be a non-negative integer.

**API Endpoints:**
- POST `/products` (for adding a product)
- PUT `/products/:id` (for updating a product)
- GET `/products/:id` (get product details)
- GET `/products?category=:categoryId` (filter products by category)

---

### 3. **Category Model**
**Key Attributes:**
- `name`: String, unique, required
- `description`: String, optional
- `createdAt`: Date, default to the current timestamp
- `updatedAt`: Date, updated when category info is modified

**Relationships:**
- One-to-many: A category can have multiple products.

**Methods/Actions:**
- Add new category.
- Update category info.

**Validation Rules:**
- `name`: Must be unique.

**API Endpoints:**
- POST `/categories` (for creating a category)
- GET `/categories` (to list all categories)

---

### 4. **Brand Model**
**Key Attributes:**
- `name`: String, unique, required
- `description`: String, optional
- `logo`: String, optional (URL or file path)
- `createdAt`: Date, default to the current timestamp
- `updatedAt`: Date, updated when brand info is modified

**Relationships:**
- One-to-many: A brand can have multiple products.

**Methods/Actions:**
- Add and manage brands.

**Validation Rules:**
- `name`: Must be unique.

**API Endpoints:**
- POST `/brands` (for adding a brand)
- GET `/brands` (to list all brands)

---

### 5. **Coupon Model**
**Key Attributes:**
- `code`: String, unique, required
- `discount`: Number (percentage or fixed amount), required
- `validFrom`: Date, required
- `validUntil`: Date, required
- `minimumOrderAmount`: Number, optional
- `status`: String (e.g., 'active', 'expired', 'used'), default `active`
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-many: A coupon can apply to many orders.

**Methods/Actions:**
- Validate coupon code during checkout.
- Mark coupon as used when redeemed.

**Validation Rules:**
- `discount`: Must be within a valid range (e.g., 1-100% or $1-$100).
- `validFrom`: Must be before `validUntil`.

**API Endpoints:**
- POST `/coupons` (for creating a coupon)
- GET `/coupons/:code` (to validate a coupon)

---

### 6. **Payment Model**
**Key Attributes:**
- `orderId`: ObjectId (reference to the `Order` model), required
- `amount`: Number (total payment amount), required
- `method`: String (e.g., 'credit card', 'PayPal'), required
- `status`: String (e.g., 'pending', 'completed', 'failed'), default `pending`
- `transactionId`: String, optional (for tracking transaction)
- `paymentDate`: Date, required
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-one: One payment is associated with one order.

**Methods/Actions:**
- Process payment for an order.
- Handle payment status updates (e.g., 'failed', 'completed').

**API Endpoints:**
- POST `/payment/:orderId` (for processing payment)
- GET `/payment/:transactionId` (to get payment details)

---

### 7. **Review Model**
**Key Attributes:**
- `productId`: ObjectId (reference to the `Product` model), required
- `userId`: ObjectId (reference to the `User` model), required
- `rating`: Number, required (1-5 stars)
- `comment`: String, optional
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-many: A product can have many reviews.
- One-to-one: A review is associated with a user.

**Methods/Actions:**
- Add a review to a product.
- Update a review.

**Validation Rules:**
- `rating`: Must be between 1 and 5.

**API Endpoints:**
- POST `/reviews` (for adding a review)
- PUT `/reviews/:id` (for updating a review)
- GET `/reviews/:productId` (to get reviews for a product)

---

### 8. **Order Model**
**Key Attributes:**
- `userId`: ObjectId (reference to the `User` model), required
- `products`: [Object] (Array of objects containing product references and quantities)
- `totalAmount`: Number, required
- `shippingAddress`: Object (contains address details)
- `paymentStatus`: String (e.g., 'pending', 'paid'), default `pending`
- `orderStatus`: String (e.g., 'new', 'shipped', 'delivered', 'cancelled')
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-many: An order can contain multiple products.
- One-to-one: An order is associated with one user.

**Methods/Actions:**
- Place an order.
- Update order status.

**Validation Rules:**
- `totalAmount`: Must match the sum of product prices and shipping costs.

**API Endpoints:**
- POST `/orders` (for placing an order)
- GET `/orders/:id` (to get order details)

---

### 9. **Cart Model**
**Key Attributes:**
- `userId`: ObjectId (reference to the `User` model), required
- `products`: [Object] (Array of product references and quantities)
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-one: Each user has one cart.

**Methods/Actions:**
- Add, update, or remove products from the cart.

**API Endpoints:**
- GET `/cart/:userId` (get cart details)
- POST `/cart/:userId/add` (add product to cart)

---

### 10. **Wishlist Model**
**Key Attributes:**
- `userId`: ObjectId (reference to the `User` model), required
- `products`: [ObjectId] (Array of product references)
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-one: A user has one wishlist.

**Methods/Actions:**
- Add and remove products from the wishlist.

**API Endpoints:**
- GET `/wishlist/:userId` (get wishlist)
- POST `/wishlist/:userId/add` (add product

 to wishlist)

---

### 11. **Shipping Method Model**
**Key Attributes:**
- `name`: String, required (e.g., 'Standard Shipping', 'Express')
- `price`: Number, required
- `deliveryTime`: String, required (e.g., '5-7 days', '1-2 days')
- `createdAt`: Date, default to the current timestamp

**Relationships:**
- One-to-many: A shipping method can be associated with multiple orders.

**Methods/Actions:**
- Add and manage shipping methods.

**API Endpoints:**
- POST `/shipping-methods` (create a shipping method)
- GET `/shipping-methods` (list all shipping methods)
