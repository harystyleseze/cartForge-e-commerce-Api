const Category = require('../models/categoryModel');

const categoryService = {
  async createCategory(categoryData) {
    return await Category.create(categoryData);
  },

  async getAllCategories() {
    return await Category.find().populate('products');
  },

  async getCategoryById(id) {
    return await Category.findById(id).populate('products');
  },

  async updateCategory(id, updateData) {
    return await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  },

  async getCategoryBySlug(slug) {
    return await Category.findOne({ slug }).populate('products');
  }
};

module.exports = categoryService;
