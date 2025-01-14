# Coupon Features
### **1. Coupon Creation and Management**

#### **Database Design**
To store and manage coupons, use this `coupons` model with key attributes:
- **Coupon Code**: Unique code that customers will use to redeem the offer.
- **Discount Type**: Defines the kind of discount (e.g., percentage, fixed amount, free shipping, buy X get Y).
- **Discount Value**: Specifies the discount value, whether it's a percentage or a fixed amount.
- **Expiration Date**: The date when the coupon expires and is no longer valid.
- **Usage Limit**: The maximum number of times the coupon can be used globally (across all customers).
- **Usage Count**: Tracks how many times the coupon has been redeemed so far.
- **Minimum Order Value**: A condition where the coupon only applies if the order exceeds a certain value.
- **Applicable Categories**: A list of product categories the coupon is valid for.
- **Customer Restrictions**: Can specify whether a coupon applies only to specific customers (e.g., new customers, VIPs).
- **Status (Active/Inactive)**: A flag to indicate whether the coupon is currently active or expired.

#### **Management Features**
- **Creating Coupons**: Admins can create new coupons with specific properties, such as setting the type of discount, expiration date, and other constraints.
- **Editing Coupons**: Admins can modify coupon details (e.g., change the discount, expiration date, or adjust usage limits).
- **Deleting Coupons**: Admins can remove expired or unused coupons to maintain a clean database.
- **Coupon Types**: The system will support multiple types of discounts, including:
  - Percentage discount (e.g., 20% off).
  - Fixed discount (e.g., $10 off).
  - Free shipping.
  - Promotional offers like "Buy 2, get 1 free."

---

### **2. Coupon Validation**

When a customer applies a coupon during checkout, the backend will need to validate the coupon before applying the discount. The validation process will involve several checks:

1. **Existence Check**: Ensure the coupon code exists in the database and is valid (i.e., hasn’t been deleted or disabled).
2. **Expiration Check**: Ensure the coupon hasn't expired by comparing the current date with the expiration date.
3. **Usage Limits**: Verify if the coupon has exceeded its maximum usage count. If the coupon is limited to a certain number of redemptions (e.g., 100 uses), the system will check if it has already been used that many times.
4. **Minimum Order Requirement**: Check if the order meets the minimum purchase amount defined for the coupon. If a coupon requires a $50 minimum order and the total is $40, it won’t be valid.
5. **Product Category Validity**: Some coupons are only valid for specific product categories. The system will ensure the coupon is being applied to eligible products in the cart.
6. **Customer Restrictions**: Some coupons may only be valid for specific users (e.g., new customers or VIP users). The backend will verify if the user meets these conditions.

---

### **3. Coupon Redemption History**

Tracking the redemption of coupons is essential for monitoring usage, preventing fraud, and generating reports. The backend will log each coupon redemption with key details:

- **Redemption Log**: Each time a coupon is redeemed, the backend will record:
  - **User**: The user who applied the coupon.
  - **Order**: The order in which the coupon was applied.
  - **Date of Redemption**: The exact time when the coupon was used.
- **Tracking Usage**: Each coupon will have a `usageCount` that gets updated every time it's applied to an order. Once the `usageCount` reaches the `usageLimit`, the coupon will no longer be valid.
- **Customer-Specific Logs**: If there are restrictions like "one-time use per customer," this will be tracked and enforced.

---

### **4. Coupon Expiry and Usage Limits**

The system must handle the expiration of coupons and enforce usage limits to prevent abuse and ensure fair use:

1. **Expiration Handling**: Coupons will have an expiration date. Once the expiration date is reached, the coupon will automatically become inactive, and customers will no longer be able to use it.
   - **Automatic Expiry Check**: The system will periodically check the expiration date of coupons. Once expired, it will be marked as inactive to prevent further use.
   
2. **Usage Limits**: The backend will track how many times each coupon has been used (`usageCount`). If the `usageCount` exceeds the `usageLimit` (e.g., coupon can only be used 100 times), it will no longer be redeemable.
   - **Customer-Specific Limits**: Some coupons may allow one-time use per customer or be limited to certain user segments (e.g., first-time customers). The system will ensure that these conditions are met.

3. **Enforcing Minimum Order Value**: Coupons can be configured to apply only when the order exceeds a specific amount (e.g., $50). If the order total is below the minimum threshold, the coupon will be rejected.

---

### **5. Integration with Checkout Process**

The coupon system needs to integrate seamlessly with the checkout process:
- **Apply Coupon**: When a user enters a coupon code, the backend will validate it and calculate the discount, updating the total order value accordingly.
- **Handle Multiple Coupons**: The system should allow or restrict the use of multiple coupons on a single order. For example, some stores may allow stacking discounts (using a percentage off and free shipping at the same time), while others may restrict this. Make it configurable and flexible.
- **Error Handling**: If a coupon is invalid or doesn’t meet the requirements, the system will return a clear error message to the user, such as "Coupon expired," "Minimum order value not met," or "Coupon code invalid."

---

### **7. Cron Jobs for Expiration and Cleanup**

To automate the process of coupon expiry and clean up unused or expired coupons:
- **Scheduled Tasks**: Set up cron jobs (or background tasks) to check for expired coupons periodically and disable them. This ensures that expired coupons do not remain active in the system.
- **Cleanup**: For coupons that are no longer used or have expired, a cleanup process can be implemented to remove them from the database after a certain period.

Use the `utils/scheduledTasks.js` file to implement the cron jobs.
---