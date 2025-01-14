const mongoose = require('mongoose');
const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');

const wishlistService = {
    async addToWishlist(userId, productId, note) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                items: [],
                shareableLink: null,
                shareLinkExpiry: null
            });
        }

        // Check if product already exists in wishlist
        if (wishlist.items.some(item => item.productId.toString() === productId)) {
            throw new Error('Product already in wishlist');
        }

        wishlist.items.push({
            productId,
            price: product.price,
            note: note || null
        });

        return await wishlist.save();
    },

    async removeFromWishlist(userId, productId) {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }

        const productIndex = wishlist.items.findIndex(
            item => item.productId.toString() === productId
        );
    
        if (productIndex === -1) {
            throw new Error('Product not found in wishlist');
        }
    
        // Remove the item from the wishlist
        wishlist.items.splice(productIndex, 1);

        return await wishlist.save();
    },

    async getWishlist(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const wishlist = await Wishlist.findOne({ userId })
            .populate('items.productId')
            .skip(skip)
            .limit(limit);

        if (!wishlist) {
            return { items: [], total: 0 };
        }

        return {
            id: wishlist._id,
            items: wishlist.items,
            shareableLink: wishlist.shareableLink,
            shareLinkId: wishlist.shareLinkId,
            shareLinkExpiry: wishlist.shareLinkExpiry,
            total: wishlist.items.length,
            page,
            limit
        };
    },

    async updateWishlistItem(userId, productId, updates) {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }

        const itemIndex = wishlist.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            throw new Error('Product not found in wishlist');
        }

        // Only allow updating note
        if (updates.note !== undefined) {
            wishlist.items[itemIndex].note = updates.note;
        }

        return await wishlist.save();
    },

    async generateShareableLink(userId, baseUrl) {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }

        // Generate a unique identifier for the link
        const uniqueId = new mongoose.Types.ObjectId().toString();
        
        // Create the shareable link using the base URL and include /api prefix
        const shareableLink = `${baseUrl}/api/wishlist/share/${uniqueId}`;
        
        // Set expiry to 30 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        wishlist.shareableLink = shareableLink;
        wishlist.shareLinkId = uniqueId;
        wishlist.shareLinkExpiry = expiryDate;
        await wishlist.save();

        return {
            shareableLink,
            shareLinkId: uniqueId,
            expiryDate
        };
    },

    async getWishlistByShareableLink(linkId) {
        const wishlist = await Wishlist.findOne({
            shareLinkId: linkId,
            shareLinkExpiry: { $gt: new Date() }
        }).populate({
            path: 'items.productId',
            select: 'name price description images stockQuantity brand category'
        });

        if (!wishlist) {
            throw new Error('Wishlist not found or link expired');
        }

        return {
            wishlistId: wishlist._id,
            shareLinkId: wishlist.shareLinkId,
            items: wishlist.items.map(item => ({
                product: {
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    description: item.productId.description,
                    images: item.productId.images,
                    stockQuantity: item.productId.stockQuantity,
                    brand: item.productId.brand,
                    category: item.productId.category
                },
                note: item.note,
                addedAt: item.addedAt
            })),
            createdAt: wishlist.createdAt,
            updatedAt: wishlist.updatedAt
        };
    },

    async getWishlistNotifications(userId) {
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return [];
        }

        const notifications = [];
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

        // Process each item in the wishlist
        for (const item of wishlist.items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            // Price Drop Notification
            if (product.price < item.price) {
                const difference = item.price - product.price;
                const percentageOff = Math.round((difference / item.price) * 100);
                
                notifications.push({
                    type: 'PRICE_DROP',
                    productId: item.productId,
                    productName: product.name,
                    oldPrice: item.price,
                    newPrice: product.price,
                    difference,
                    percentageOff,
                    message: `Good news! ${product.name} is now ${percentageOff}% off—check it out!`,
                    timestamp: new Date()
                });

                // Update the stored price in wishlist
                item.price = product.price;
            }

            // Stock Status Notifications
            if (product.stockQuantity === 0 && !item.outOfStock) {
                notifications.push({
                    type: 'OUT_OF_STOCK',
                    productId: item.productId,
                    productName: product.name,
                    message: `${product.name} is currently out of stock. We'll notify you when it's back!`,
                    timestamp: new Date()
                });
                item.outOfStock = true;
            } else if (product.stockQuantity > 0 && item.outOfStock) {
                notifications.push({
                    type: 'BACK_IN_STOCK',
                    productId: item.productId,
                    productName: product.name,
                    stockQuantity: product.stockQuantity,
                    message: `${product.name} is back in stock—grab it before it's gone!`,
                    timestamp: new Date()
                });
                item.outOfStock = false;
            }

            // Wishlist Reminder (if no interaction for 30 days)
            if (item.lastInteractionDate < thirtyDaysAgo) {
                notifications.push({
                    type: 'WISHLIST_REMINDER',
                    productId: item.productId,
                    productName: product.name,
                    message: `Still thinking about ${product.name}? It's waiting for you!`,
                    timestamp: new Date()
                });
            }

            // Limited Stock Notification (if stock is low but not zero)
            if (product.stockQuantity > 0 && product.stockQuantity <= 5) {
                notifications.push({
                    type: 'LIMITED_STOCK',
                    productId: item.productId,
                    productName: product.name,
                    stockQuantity: product.stockQuantity,
                    message: `Only ${product.stockQuantity} left! ${product.name} is almost out of stock.`,
                    timestamp: new Date()
                });
            }

            // Update stock quantity and last interaction
            item.stockQuantity = product.stockQuantity;
            item.lastInteractionDate = new Date();
        }

        // Save updates to wishlist
        await wishlist.save();

        return notifications;
    },

    async clearExpiredLinks() {
        return await Wishlist.updateMany(
            { shareLinkExpiry: { $lt: new Date() } },
            { 
                $set: { 
                    shareableLink: null,
                    shareLinkId: null,
                    shareLinkExpiry: null
                }
            }
        );
    }
};

module.exports = wishlistService;
