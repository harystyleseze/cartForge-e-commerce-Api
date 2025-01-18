const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  addresses: [addressSchema],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cart'
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Clear/clean up
userSchema.pre('remove', async function(next) {
  try {
    // Clean up associated data
    if (this.cart) {
      await mongoose.model('Cart').findByIdAndDelete(this.cart);
    }
    
    // Delete user's reviews
    await mongoose.model('Review').deleteMany({ userId: this._id });
    
    // Delete user's orders
    await mongoose.model('Order').deleteMany({ userId: this._id });
    
    // Delete user's wishlist
    await mongoose.model('Wishlist').deleteMany({ userId: this._id });
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
