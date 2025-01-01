# Register Admin User
POST http://localhost:3000/api/auth/register
{
  "email": "test2.user@example.com",
  "password": "SecurePass1234!",
  "name": "Test User",
  "phone": "+1234567890",
  "role": "admin",
  "address": {
    "street": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "country": "Test Country",
    "zipCode": "12345"
  }
}

# Login
POST http://localhost:3000/api/auth/login
{
  "email": "test2.user@example.com",
  "password": "SecurePass1234!"
}

# Get All Users
GET http://localhost:3000/api/users/all