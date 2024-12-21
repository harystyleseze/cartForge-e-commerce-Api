const productService = require('../services/productService');

const productController = {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body, req.files);
      res.status(201).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
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

  async updateProductImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No image files provided'
        });
      }

      const product = await productService.updateProductImages(req.params.id, req.files);
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async deleteProductImage(req, res) {
    try {
      const product = await productService.deleteProductImage(req.params.id, req.params.imageId);
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  async updateProductStock(req, res) {
    try {
      const product = await productService.updateProductStock(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: { product }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = productController;
