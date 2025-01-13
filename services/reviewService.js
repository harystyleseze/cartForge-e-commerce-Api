
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

const reviewService = {
    async createReview(productId, reviewData, userId) {
        try {
          // Check if the product exists
          const product = await Product.findById(productId);
          if (!product) {
            return { message: 'Product not found' }; // Return a custom message if product is not found
          }
      
          // Check if the user has already reviewed this product
          const existingReview = await Review.findOne({ productId, userId });
          if (existingReview) {
            return { message: 'You have already reviewed this product' }; // Return a custom message if review already exists
          }
      
          // Create a new review
          const review = await Review.create({
            productId,
            userId,
            ...reviewData
          });
      
          // Log product details before and after updating the rating and review count
          // console.log('Before updating product after creating review:', product);
      
          // // Update the product's rating and review count
          // await product.updateRatingAndReviewsCount();
      
          // console.log('After updating product after creating review:', product);
      
          // Return the created review
          return review;
      
        } catch (error) {
          // Handle potential errors (e.g., database issues, invalid data)
          console.error("Error creating review:", error);
          throw new Error("An error occurred while creating the review.");
        }
      },

  async getReviewsForProduct(productId) {
    try {
      // Fetch the reviews for the given productId
      const reviews = await Review.find({ productId })
        .populate('userId') // Populate user details
        .exec();
  
      // If no reviews are found, return a custom message
      if (reviews.length === 0) {
        return { message: "No reviews for this product." };
      }
  
      // Return the reviews if found
      return reviews;
    } catch (error) {
      // Handle other errors (e.g., database connection issues)
      console.error("Error fetching reviews:", error);
      throw new Error("An error occurred while fetching reviews.");
    }
  },
  

  async getReviewById(reviewId) {
    try {
      // Fetch the review by its ID
      const review = await Review.findById(reviewId)
        .populate('userId') // Populate user details
        .exec();
  
      // Check if the review exists
      if (!review) {
        return { message: "Review not found." };
      }
  
      // Return the review if found
      return review;
    } catch (error) {
      // Handle other errors (e.g., invalid ID format, database issues)
      console.error("Error fetching review:", error);
      throw new Error("An error occurred while fetching the review.");
    }
  },
   // Get all reviews for a product
     async getAllReviewsByProduct(productId) {
     return await Review.find({ productId }).populate('userId', 'name email');
   },

  async updateReview(reviewId, updatedData) {
    try {
      // Find and update the review by its ID
      const review = await Review.findByIdAndUpdate(reviewId, updatedData, {
        new: true,           // Return the updated document
        runValidators: true  // Ensure validation rules are applied
      });
  
      // If the review doesn't exist, return an appropriate message
      if (!review) {
        return { message: "Review not found." };
      }
  
      // Fetch the related product to update its rating and review count
      const product = await Product.findById(review.productId);
      if (!product) {
        return { message: "Product not found." };
      }
  
      // Log the product details before and after updating the rating/review count
      console.log('Before updating product rating and review count:', product);
  
      // Update the product's rating and review count based on the new review data
      await product.updateRatingAndReviewsCount();
  
      console.log('After updating product rating and review count:', product);
  
      // Return the updated review
      return review;
  
    } catch (error) {
      // Handle other potential errors
      console.error("Error updating review:", error);
      throw new Error("An error occurred while updating the review.");
    }
  },

  async deleteReview(reviewId) {
    try {
      // Find and delete the review by its ID
      const review = await Review.findByIdAndDelete(reviewId);
  
      // If the review doesn't exist, return an appropriate message
      if (!review) {
        return { message: "Review not found." };
      }
  
      // Fetch the product associated with the review to update its rating and review count
      const product = await Product.findById(review.productId);
      if (!product) {
        return { message: "Product not found." };
      }
  
      // Log product details before and after the update
      console.log('Before updating product before deleting review:', product);
  
      // Update the product's rating and review count after deleting the review
      await product.updateRatingAndReviewsCount();
  
      console.log('After updating product after deleting review:', product);
  
      // Return the deleted review (or a confirmation message)
      return review;
  
    } catch (error) {
      // Handle potential errors such as database issues, connection problems, etc.
      console.error("Error deleting review:", error);
      throw new Error("An error occurred while deleting the review.");
    }
  }
};

module.exports = reviewService;


// const Review = require('../models/reviewModel');
// const Product = require('../models/productModel');

// const reviewService = {
//   // Create a review
//   async createReview(reviewData) {
//     const { productId, userId, rating, comment } = reviewData;

//     // Check if the user already reviewed this product
//     const existingReview = await Review.findOne({ productId, userId });
//     if (existingReview) {
//       throw new Error('You have already reviewed this product');
//     }

//     // Create and save the review
//     return await Review.create({ productId, userId, rating, comment });
//   },

//   // Get all reviews for a product
//   async getAllReviewsByProduct(productId) {
//     return await Review.find({ productId }).populate('userId', 'name email');
//   },

//   // Update a review
//   async updateReview(reviewId, updateData) {
//     return await Review.findByIdAndUpdate(reviewId, updateData, { new: true, runValidators: true });
//   },

//   // Delete a review
//   async deleteReview(reviewId) {
//     return await Review.findByIdAndDelete(reviewId);
//   },

//   // Get review by user and product (for update and delete logic)
//   async getReviewByUserAndProduct(userId, productId) {
//     return await Review.findOne({ userId, productId });
//   }
// };

// module.exports = reviewService;
