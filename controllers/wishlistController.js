const wishlistService = require('../services/wishlistService');

const wishlistController = {
    async addToWishlist(req, res) {
        try {
            const wishlist = await wishlistService.addToWishlist(
                req.user._id,
                req.body.productId,
                req.body.note
            );
            res.status(201).json({
                status: 'success',
                data: { wishlist }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async removeFromWishlist(req, res) {
        try {
            const wishlist = await wishlistService.removeFromWishlist(
                req.user._id,
                req.params.productId
            );
            res.status(200).json({
                status: 'success',
                data: { wishlist }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async getWishlist(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const wishlist = await wishlistService.getWishlist(
                req.user._id,
                page,
                limit
            );
            res.status(200).json({
                status: 'success',
                data: wishlist
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async updateWishlistItem(req, res) {
        try {
            const wishlist = await wishlistService.updateWishlistItem(
                req.user._id,
                req.params.productId,
                { note: req.body.note }
            );
            res.status(200).json({
                status: 'success',
                data: { wishlist }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async getNotifications(req, res) {
        try {
            const notifications = await wishlistService.getWishlistNotifications(
                req.user._id
            );
            res.status(200).json({
                status: 'success',
                data: { notifications }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async generateShareableLink(req, res) {
        try {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            
            const { shareableLink, shareLinkId, expiryDate } = await wishlistService.generateShareableLink(
                req.user._id,
                baseUrl
            );
            
            res.status(200).json({
                status: 'success',
                data: { 
                    shareableLink,
                    shareLinkId,
                    expiryDate
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async getWishlistByLink(req, res) {
        try {
            const linkId = req.params.linkId;
            const wishlist = await wishlistService.getWishlistByShareableLink(linkId);
            
            res.status(200).json({
                status: 'success',
                data: { 
                    wishlist,
                    id: linkId,
                    message: 'Shared wishlist retrieved successfully'
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message || 'Unable to retrieve shared wishlist'
            });
        }
    },

    async clearExpiredLinks(req, res) {
        try {
            const result = await wishlistService.clearExpiredLinks();
            res.status(200).json({
                status: 'success',
                data: { 
                    message: 'Expired links cleared successfully',
                    clearedCount: result.modifiedCount
                }
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message || 'Unable to clear expired links'
            });
        }
    }
};

module.exports = wishlistController;
