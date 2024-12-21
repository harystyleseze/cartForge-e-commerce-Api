implementation:

### Admin Order Endpoints

1. **Get All Orders**
   - **Endpoint:** `GET /api/admin/orders`
   - **Query Params:** `status`, `page`, `limit`
   - **Response:**
     ```json
     {
       "status": "success",
       "results": 2,
       "data": { "orders": [ /* order objects */ ] }
     }
     ```

2. **Update Order Status**
   - **Endpoint:** `PATCH /api/admin/orders/:orderId/status`
   - **Request Body:**
     ```json
     { "status": "shipped" }
     ```
   - **Response:**
     ```json
     {
       "status": "success",
       "data": { "order": { "orderStatus": "shipped" } }
     }
     ```

3. **Process Refund**
   - **Endpoint:** `POST /api/admin/orders/:orderId/refund`
   - **Request Body:**
     ```json
     { "amount": 999.99, "reason": "Customer request" }
     ```
   - **Response:**
     ```json
     {
       "status": "success",
       "data": { "refund": { "amount": 999.99, "status": "completed" } }
     }
     ```

### Flow Overview

- **Order Status Transitions:**
  - `Pending` → `Processing` → `Shipped` → `Delivered` → `Completed`
  - Any status can transition to `Cancelled`.

- **Refund Process:**
  - Admin initiates refund.
  - Stripe processes refund.
  - Customer notified via email.

### Example Usage

```javascript
// Fetch processing orders
await fetch('/api/admin/orders?status=processing', { headers: { 'Authorization': `Bearer ${adminToken}` } });

// Update order status
await fetch(`/api/admin/orders/${orderId}/status`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'shipped' }) });

// Process refund
await fetch(`/api/admin/orders/${orderId}/refund`, { method: 'POST', headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 999.99, reason: 'Customer request' }) });
```

### Error Handling

- **Invalid Status Transition:** `"Invalid status transition"`
- **Refund Exceeds Total:** `"Refund amount cannot exceed order total"`
- **Order Not Found:** `"Order not found"`
- **Unauthorized Access:** `"Access denied. Admin only."`