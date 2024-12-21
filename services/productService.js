const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs').promises;

const productService = {
  async uploadProductImages(files) {
    const uploadPromises = files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          use_filename: true,
          unique_filename: true
        });

        // Delete the local file after upload
        await fs.unlink(file.path);

        return {
          url: result.secure_url,
          publicId: result.public_id,
          isMain: false // Will be updated later if needed
        };
      } catch (error) {
        // Delete the local file if upload fails
        if (file.path) {
          await fs.unlink(file.path).catch(() => {});
        }
        throw error;
      }
    });

    return await Promise.all(uploadPromises);
  },

  async createProduct(productData, imageFiles) {
    let images = [];
    
    // Upload images if provided
    if (imageFiles && imageFiles.length > 0) {
      images = await this.uploadProductImages(imageFiles);
      if (images.length > 0) {
        images[0].isMain = true;
      }
    }

    // Create product with all data including images
    const productToCreate = {
      ...productData,
      images
    };

    return await Product.create(productToCreate);
  },

  async updateProductImages(productId, imageFiles) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // Delete old images from Cloudinary
    const deletePromises = product.images.map(image => 
      cloudinary.uploader.destroy(image.publicId)
    );
    await Promise.all(deletePromises);

    // Upload new images
    const images = await this.uploadProductImages(imageFiles);
    if (images.length > 0) {
      images[0].isMain = true;
    }

    // Update product with new images
    return await Product.findByIdAndUpdate(
      productId,
      { images },
      { new: true }
    );
  },

  async getAllProducts(queryParams) {
    const query = Product.find();
    
    // Filter by category
    if (queryParams.category) {
      query.where('category').equals(queryParams.category);
    }

    // Filter by brand
    if (queryParams.brand) {
      query.where('brand').equals(queryParams.brand);
    }

    // Search by name or description
    if (queryParams.search) {
      query.or([
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } }
      ]);
    }

    // Filter by price range
    if (queryParams.minPrice) {
      query.where('price').gte(queryParams.minPrice);
    }
    if (queryParams.maxPrice) {
      query.where('price').lte(queryParams.maxPrice);
    }

    // Sort
    if (queryParams.sort) {
      query.sort(queryParams.sort);
    }

    return await query
      .populate('category', 'name')
      .populate('brand', 'name')
      .exec();
  },

  async getProductById(productId) {
    return await Product.findById(productId)
      .populate('category', 'name')
      .populate('brand', 'name')
      .populate('reviews');
  },

  async updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId);
  },

  async updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    
    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
    
    product.stockQuantity -= quantity;
    return await product.save();
  },

  async deleteProductImage(productId, imageId) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    const image = product.images.id(imageId);
    if (!image) throw new Error('Image not found');

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Remove image from product
    product.images.pull(imageId);
    
    // If we deleted the main image, make the first remaining image (if any) the main one
    if (image.isMain && product.images.length > 0) {
      product.images[0].isMain = true;
    }

    return await product.save();
  },

  async updateProductStock(productId, stockData) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    // Validate stock quantity
    if (stockData.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    return await Product.findByIdAndUpdate(
      productId,
      { stockQuantity: stockData.stockQuantity },
      { new: true, runValidators: true }
    );
  }
};

module.exports = productService;
