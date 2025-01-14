const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        maxLength: 500
    },
    price: {
        type: Number,
        required: true
    },
    outOfStock: {
        type: Boolean,
        default: false
    },
    lastInteractionDate: {
        type: Date,
        default: Date.now
    },
    stockQuantity: {
        type: Number,
        default: null
    }
});

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [wishlistItemSchema],
    shareableLink: {
        type: String,
        default: null
    },
    shareLinkId: {
        type: String,
        default: null
    },
    shareLinkExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
