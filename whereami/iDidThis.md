# What I Have Implemented

## Core Implementations

 -- User Authentication: login service, register service, generate token service, protect (to keep track if user still logged in with token)
 -- User/Admin registration/creation
 -- 

# The Hows and Whats

## User Auth Flow
```
const authRoutes = require('./routes/authRoutes');
```
### Route
router.post('/register', authController.register);
router.post('/login', authController.login);
### Middleware
Protect  - get token from request, verify/decode it, and grant request permission to proceed.
### Controller
Prepare the request data from the user while trying to register or login. This checks and ensures that the email addresses are unique to each users.

### Logic/Service
Key implementation logics to find user by email, register user/admin, login user/dmin, and generate token for user.


## User
### Model

### Route

### Middleware

### Controller
 
### Logic/Service


## User

### Model

### Route

### Middleware

### Controller
 
### Logic/Service


## User

### Model

### Route

### Middleware

### Controller
 
### Logic/Service


## User

### Model

### Route

### Middleware

### Controller
 
### Logic/Service