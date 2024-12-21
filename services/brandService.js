const Brand = require('../models/brandModel');
const cloudinary = require('../utils/cloudinary');

const brandService = {
  async createBrand(brandData, logoFile) {
    let logo = {};
    
    if (logoFile) {
      const result = await cloudinary.uploader.upload(logoFile.path, {
        folder: 'brands',
        use_filename: true
      });
      logo = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    return await Brand.create({ ...brandData, logo });
  },

  async getAllBrands() {
    return await Brand.find().populate('products');
  },

  async getBrandById(id) {
    return await Brand.findById(id).populate('products');
  },

  async updateBrand(id, updateData, logoFile) {
    const brand = await Brand.findById(id);
    
    if (logoFile) {
      // Delete old logo if exists
      if (brand.logo.publicId) {
        await cloudinary.uploader.destroy(brand.logo.publicId);
      }
      
      const result = await cloudinary.uploader.upload(logoFile.path, {
        folder: 'brands',
        use_filename: true
      });
      
      updateData.logo = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    return await Brand.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteBrand(id) {
    const brand = await Brand.findById(id);
    if (brand.logo.publicId) {
      await cloudinary.uploader.destroy(brand.logo.publicId);
    }
    return await Brand.findByIdAndDelete(id);
  },

  async getBrandBySlug(slug) {
    return await Brand.findOne({ slug }).populate('products');
  }
};

module.exports = brandService;
