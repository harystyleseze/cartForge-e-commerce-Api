e-commerce-api/
│
├── controllers/             # All controller files (business logic layer)
│   ├── userController.js    # User-related actions (register, login, profile update, etc.)
│   ├── productController.js # Product-related actions (add, update, get products, etc.)
│   ├── orderController.js   # Order-related actions (create order, update status, etc.)
│   ├── categoryController.js# Category-related actions
│   ├── brandController.js   # Brand-related actions
│   ├── couponController.js  # Coupon-related actions
│   ├── paymentController.js # Payment-related actions
│   ├── reviewController.js  # Review-related actions
│   ├── cartController.js    # Cart-related actions
│   ├── wishlistController.js# Wishlist-related actions
│   ├── shippingMethodController.js # Shipping method actions
│   └── authController.js    # Authentication (login, register, JWT token)
│
├── models/                  # Mongoose model files (database schema)
│   ├── userModel.js         # User schema
│   ├── productModel.js      # Product schema
│   ├── orderModel.js        # Order schema
│   ├── categoryModel.js     # Category schema
│   ├── brandModel.js        # Brand schema
│   ├── couponModel.js       # Coupon schema
│   ├── paymentModel.js      # Payment schema
│   ├── reviewModel.js       # Review schema
│   ├── cartModel.js         # Cart schema
│   ├── wishlistModel.js     # Wishlist schema
│   ├── shippingMethodModel.js # Shipping method schema
│   └── db.js                # MongoDB connection and initialization
│
├── routes/                  # Route definitions
│   ├── userRoutes.js        # Routes for user actions
│   ├── productRoutes.js     # Routes for product-related actions
│   ├── orderRoutes.js       # Routes for order-related actions
│   ├── categoryRoutes.js    # Routes for category actions
│   ├── brandRoutes.js       # Routes for brand actions
│   ├── couponRoutes.js      # Routes for coupon actions
│   ├── paymentRoutes.js     # Routes for payment actions
│   ├── reviewRoutes.js      # Routes for review actions
│   ├── cartRoutes.js        # Routes for cart actions
│   ├── wishlistRoutes.js    # Routes for wishlist actions
│   ├── shippingMethodRoutes.js # Routes for shipping method actions
│   └── authRoutes.js        # Routes for authentication (login, register)
│
├── services/                # Services (business logic and data interaction)
│   ├── userService.js       # Business logic related to user management
│   ├── productService.js    # Product management logic
│   ├── orderService.js      # Order management logic
│   ├── categoryService.js   # Category management logic
│   ├── brandService.js      # Brand management logic
│   ├── couponService.js     # Coupon validation logic
│   ├── paymentService.js    # Payment processing logic
│   ├── reviewService.js     # Review management logic
│   ├── cartService.js       # Cart management logic
│   ├── wishlistService.js   # Wishlist management logic
│   ├── shippingMethodService.js # Shipping method management logic
│   └── authService.js       # Authentication logic (JWT, bcrypt, etc.)
│
├── middlewares/             # Middleware for validations, authorization, etc.
│   ├── authMiddleware.js    # JWT authentication middleware
│   ├── validateMiddleware.js# Input validation middleware
│   ├── errorMiddleware.js   # Error handling middleware
│   └── permissionMiddleware.js # Authorization (admin, user roles)
│
├── utils/                   # Utility files for common functions
│   ├── logger.js            # Logging utility (e.g., Winston, Morgan)
│   ├── validators.js        # Input validation functions
│   ├── mailer.js            # Mail sending utility (for email notifications)
│   ├── token.js             # JWT token creation and verification
│   └── fileUploader.js      # File upload utility (for images, etc.)
│
├── config/                  # Configuration files (environment variables, constants)
│   ├── dbConfig.js          # Database configuration
│   ├── serverConfig.js      # Server configuration (e.g., port)
│   └── envConfig.js         # Environment variable loading (dotenv)
│
├── tests/                   # Unit and integration tests
│   ├── user.test.js         # Tests for user-related functionality
│   ├── product.test.js      # Tests for product-related functionality
│   ├── order.test.js        # Tests for order-related functionality
│   ├── category.test.js     # Tests for category-related functionality
│   ├── brand.test.js        # Tests for brand-related functionality
│   ├── coupon.test.js       # Tests for coupon-related functionality
│   ├── payment.test.js      # Tests for payment functionality
│   ├── review.test.js       # Tests for review functionality
│   ├── cart.test.js         # Tests for cart functionality
│   ├── wishlist.test.js     # Tests for wishlist functionality
│   ├── shippingMethod.test.js # Tests for shipping method functionality
│   └── auth.test.js         # Tests for authentication functionality
│
├── public/                  # Public assets (e.g., images, static files)
│   └── images/              # Folder for product images or user avatars
│
├── .env                     # Environment variables (DB credentials, JWT secret, etc.)
├── .gitignore               # Git ignore file (e.g., node_modules, .env)
├── package.json             # NPM dependencies and scripts
├── README.md                # Project overview and setup instructions
└── server.js                # Entry point for the application (Express app initialization)