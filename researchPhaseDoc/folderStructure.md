e-commerce-api/
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── brandRoutes.js
│   ├── cartRoutes.js
│   ├── shippingMethodRoutes.js
│   ├── orderRoutes.js
│   ├── adminOrderRoutes.js
│   ├── reviewRoutes.js
│   ├── wishlistRoutes.js
│   └── couponRoutes.js
│
├── controllers/
│   ├── orderController.js
│   ├── adminOrderController.js
│   ├── cartController.js
│   ├── productController.js
│   ├── brandController.js
│   ├── couponController.js
│   ├── wishlistController.js
│   └── paymentController.js
│   └── authController.js
│
├── models/
│   ├── cartModel.js
│   ├── userModel.js
│   ├── productModel.js
│   ├── couponModel.js
│   ├── paymentModel.js
│   ├── reviewModel.js
│   ├── orderModel.js
│   ├── brandModel.js
│   └── wishlistModel.js
│
├── services/
│   ├── orderService.js
│   ├── cartService.js
│   ├── productService.js
│   ├── brandService.js
│   ├── couponService.js
│   ├── wishlistService.js
│   ├── paymentService.js
│   ├── shippingMethodService.js
│   └── currencyService.js
│
├── middlewares/
│   ├── errorMiddleware.js
│   └── authMiddleware.js
│
├── utils/
│   ├── scheduledTasks.js
│   ├── cloudinary.js
│   └── authUtils.js
│
├── tests/
│   ├── cart.test.js
│   ├── wishlist.test.js
│   ├── notifications.test.js
│   ├── order.test.js
│   └── coupon.test.js
│
├── config/
│   └── serverConfig.js
│
├── uploads/                  # Directory for file uploads
│   └── images/              # Product and user images
│
├── public/                  # Public assets
│   └── images/             # Static image files
│
├── doc/
│   ├── features.md
│   └── structure.md
│
├── apiDoc/
│   ├── orderServices/
│   │   └── order/
│   │       ├── orderProcessService.md
│   │       ├── sampleOrderImplementation.md
│   │       └── sampleTest.md
│   └── order/
│       └── sampleTest.md
│
├── researchPhaseDoc/
│   ├── features.md
│   ├── models.md
│   ├── structure.md
│   └── folderStructure.md
│
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── server.js               # Application entry point

1. **Route Organization**: All routes are defined separately and imported into `server.js`

2. **MVC Pattern**: The codebase follows Model-View-Controller pattern with:
   - Models for database schemas
   - Controllers for request handling
   - Services for business logic

3. **Documentation**: Multiple documentation folders:
   - `apiDoc/` for API documentation
   - `doc/` for feature documentation
   - `researchPhaseDoc/` for research and planning docs

4. **Testing**: Separate test files for different features

5. **Configuration**: Environment variables and server configuration are separated

6. **File Upload**: Dedicated uploads directory for file storage

7. **Error Handling**: Centralized error middleware
