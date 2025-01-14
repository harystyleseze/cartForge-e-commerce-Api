const mongoose = require('mongoose');

const validateMiddleware = {
    validateObjectId(paramName) {
        return (req, res, next) => {
            const id = req.params[paramName] || req.body[paramName];
            
            if (!id) {
                return res.status(400).json({
                    status: 'error',
                    message: `${paramName} is required`
                });
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid ${paramName}`
                });
            }

            next();
        };
    },

    validateShareableLink(req, res, next) {
        const linkId = req.params.linkId;
        
        if (!linkId || linkId.length < 24) { // Basic validation for MongoDB ObjectId length
            return res.status(400).json({
                status: 'error',
                message: 'Invalid shareable link format'
            });
        }
        
        next();
    }
};

module.exports = validateMiddleware; 