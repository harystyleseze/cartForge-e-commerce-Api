const cron = require('node-cron');
const wishlistService = require('../services/wishlistService');
const logger = require('./logger');

// Schedule tasks
const scheduleTasks = () => {
    // Run cleanup at midnight every day
    cron.schedule('0 0 * * *', async () => {
        try {
            const result = await wishlistService.clearExpiredLinks();
            logger.info(`Cleared ${result.modifiedCount} expired wishlist links`);
        } catch (error) {
            logger.error('Error clearing expired links:', error);
        }
    });

    // For testing: run every minute
    cron.schedule('* * * * *', async () => {
        // try {
        //     const result = await wishlistService.clearExpiredLinks();
        //     logger.info(`Cleared ${result.modifiedCount} expired wishlist links`);
        // } catch (error) {
        //     logger.error('Error clearing expired links:', error);
        // }
    });

    // Add more scheduled tasks here
};

module.exports = scheduleTasks; 