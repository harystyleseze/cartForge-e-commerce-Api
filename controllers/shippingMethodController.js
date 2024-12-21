const shippingMethodService = require('../services/shippingMethodService');

const shippingMethodController = {
  async createShippingMethod(req, res) {
    try {
      const shippingMethod = await shippingMethodService.createShippingMethod(req.body);
      res.status(201).json({
        status: 'success',
        data: { shippingMethod }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAllShippingMethods(req, res) {
    try {
      const shippingMethods = await shippingMethodService.getAllShippingMethods(req.query);
      res.status(200).json({
        status: 'success',
        results: shippingMethods.length,
        data: { shippingMethods }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getShippingMethod(req, res) {
    try {
      const shippingMethod = await shippingMethodService.getShippingMethodById(req.params.id);
      if (!shippingMethod) {
        return res.status(404).json({
          status: 'error',
          message: 'Shipping method not found'
        });
      }
      res.status(200).json({
        status: 'success',
        data: { shippingMethod }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateShippingMethod(req, res) {
    try {
      const shippingMethod = await shippingMethodService.updateShippingMethod(
        req.params.id,
        req.body
      );
      if (!shippingMethod) {
        return res.status(404).json({
          status: 'error',
          message: 'Shipping method not found'
        });
      }
      res.status(200).json({
        status: 'success',
        data: { shippingMethod }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteShippingMethod(req, res) {
    try {
      const shippingMethod = await shippingMethodService.deleteShippingMethod(req.params.id);
      if (!shippingMethod) {
        return res.status(404).json({
          status: 'error',
          message: 'Shipping method not found'
        });
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAvailableShippingMethods(req, res) {
    try {
    
    const { weight, totalAmount, countryCode } = req.query;
    
    //   const { totalAmount, weight, country } = req.query;
      
    //   const queryParams = {
    //     totalAmount: parseFloat(totalAmount),
    //     weight: parseFloat(weight),
    //     shippingAddress: country ? { country } : undefined
    //   };

    //   const shippingMethods = await shippingMethodService.getAvailableShippingMethods(queryParams);
    const orderData = {
        weight: weight ? parseFloat(weight) : undefined,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        countryCode: countryCode ? countryCode.toUpperCase() : undefined
      };

      const shippingMethods = await shippingMethodService.getAvailableShippingMethods(orderData);
      
      res.status(200).json({
        status: 'success',
        results: shippingMethods.length,
        data: { shippingMethods }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async calculateShippingCost(req, res) {
    try {
      const { shippingMethodId } = req.params;
      const { weight, totalAmount, countryCode } = req.query;

      const costDetails = await shippingMethodService.calculateShippingCost(
        shippingMethodId,
        {
          weight: parseFloat(weight),
          totalAmount: parseFloat(totalAmount),
          countryCode
        }
      );

      res.status(200).json({
        status: 'success',
        data: costDetails
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = shippingMethodController;
