const brandService = require('../services/brandService');

const brandController = {
  async createBrand(req, res) {
    try {
      const brand = await brandService.createBrand(req.body, req.file);
      res.status(201).json({
        status: 'success',
        data: { brand }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAllBrands(req, res) {
    try {
      const brands = await brandService.getAllBrands();
      res.status(200).json({
        status: 'success',
        results: brands.length,
        data: { brands }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getBrand(req, res) {
    try {
      const brand = await brandService.getBrandById(req.params.id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }
      res.status(200).json({
        status: 'success',
        data: { brand }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateBrand(req, res) {
    try {
      const brand = await brandService.updateBrand(
        req.params.id, 
        req.body,
        req.file
      );
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }
      res.status(200).json({
        status: 'success',
        data: { brand }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteBrand(req, res) {
    try {
      const brand = await brandService.deleteBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
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
  }
};

module.exports = brandController;
