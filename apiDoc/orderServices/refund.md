# Test the refund process:

````http
POST http://localhost:3000/api/admin/orders/6747a66833beaa8b6dcbb6cf/refund
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "amount": 50,
  "reason": "requested_by_customer"
}
````

Expected Response:
````json
{
  "status": "success",
  "data": {
    "refund": {
      "_id": "6747a66833beaa8b6dcbb6d0",
      "orderId": "6747a66833beaa8b6dcbb6cf",
      "userId": "6747a66833beaa8b6dcbb6ce",
      "amount": 50,
      "reason": "requested_by_customer",
      "stripeRefundId": "re_dummy_1234567890",
      "status": "succeeded",
      "createdAt": "2024-03-15T12:00:00.000Z"
    },
    "order": {
      "id": "6747a66833beaa8b6dcbb6cf",
      "refundStatus": "partial",
      "refundedAmount": 50,
      "remainingAmount": 40,
      "orderStatus": "processing",
      "paymentStatus": "partially_refunded"
    }
  }
}
````

For a full refund:
````json
{
  "amount": 90,
  "reason": "requested_by_customer"
}
````

Response:
````json
{
  "status": "success",
  "data": {
    "refund": {
      // ... refund details
    },
    "order": {
      "id": "6747a66833beaa8b6dcbb6cf",
      "refundStatus": "full",
      "refundedAmount": 90,
      "remainingAmount": 0,
      "orderStatus": "cancelled",
      "paymentStatus": "refunded"
    }
  }
}
````