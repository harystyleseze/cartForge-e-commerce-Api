const ShippingMethod = require('../models/shippingMethodModel');
const { getRegionForCountry } = require('../utils/regionMapper');

const shippingMethodService = {
  async createShippingMethod(data) {
    // If no region pricing is provided, create default pricing based on base price
    if (!data.regionPricing || data.regionPricing.length === 0) {
      data.regionPricing = [
        {
          region: 'domestic',
          basePrice: data.price,
          pricePerKg: data.price * 0.1, // 10% of base price per kg as default
          freeShippingThreshold: data.restrictions?.minOrderAmount || 0
        },
        {
          region: 'international',
          basePrice: data.price * 2, // Double price for international
          pricePerKg: data.price * 0.2, // 20% of base price per kg as default
          freeShippingThreshold: (data.restrictions?.minOrderAmount || 0) * 2
        }
      ];
    }

    return await ShippingMethod.create(data);
  },

  async getAllShippingMethods(filters = {}) {
    const query = {};
    
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.maxPrice) {
      query.price = { $lte: parseFloat(filters.maxPrice) };
    }

    if (filters.minPrice) {
      query.price = { ...query.price, $gte: parseFloat(filters.minPrice) };
    }

    return await ShippingMethod.find(query).sort({ createdAt: -1 });
  },

  async getShippingMethodById(id) {
    return await ShippingMethod.findById(id);
  },

  async updateShippingMethod(id, updateData) {
    return await ShippingMethod.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  },

  async deleteShippingMethod(id) {
    return await ShippingMethod.findByIdAndDelete(id);
  },

  async getAvailableShippingMethods(orderData) {
    const query = { isActive: true };

    // Filter by order amount if minimum order amount is set
    if (orderData.totalAmount) {
      query['restrictions.minOrderAmount'] = { $lte: orderData.totalAmount };
    }

    // Filter by weight if order weight is provided
    if (orderData.weight) {
      query['restrictions.minWeight'] = { $lte: orderData.weight };
      query['restrictions.maxWeight'] = { $gte: orderData.weight };
    }

    // Filter by country if shipping address is provided
    if (orderData.shippingAddress?.country) {
      query.$or = [
        { 'restrictions.allowedCountries': orderData.shippingAddress.country },
        { 'restrictions.allowedCountries': { $exists: false } }
      ];
    }

    return await ShippingMethod.find(query);
  },
  
  async calculateShippingCost(shippingMethodId, orderData) {
    const {
      weight = 0,
      totalAmount = 0,
      countryCode
    } = orderData;

    const shippingMethod = await ShippingMethod.findById(shippingMethodId);
    if (!shippingMethod) {
      throw new Error('Shipping method not found');
    }

    const region = getRegionForCountry(countryCode);
    let regionPricing = shippingMethod.regionPricing.find(
      pricing => pricing.region === region
    );

    // If no specific region pricing found, fall back to base price
    if (!regionPricing) {
      regionPricing = {
        region: 'international',
        basePrice: shippingMethod.price,
        pricePerKg: shippingMethod.price * 0.1,
        freeShippingThreshold: shippingMethod.restrictions?.minOrderAmount || 0
      };
    }

    // Check if order qualifies for free shipping
    if (regionPricing.freeShippingThreshold && 
        totalAmount >= regionPricing.freeShippingThreshold) {
      return {
        cost: 0,
        details: {
          basePrice: regionPricing.basePrice,
          weightCharge: 0,
          discount: regionPricing.basePrice + (weight * regionPricing.pricePerKg),
          freeShippingApplied: true
        }
      };
    }

    // Calculate shipping cost
    const weightCharge = weight * regionPricing.pricePerKg;
    const totalCost = regionPricing.basePrice + weightCharge;

    return {
      cost: totalCost,
      details: {
        basePrice: regionPricing.basePrice,
        weightCharge,
        discount: 0,
        freeShippingApplied: false
      }
    };
  },

  async getAvailableShippingMethods(orderData) {
    const {
      totalAmount = 0,
      weight = 0,
      countryCode
    } = orderData;

    const region = getRegionForCountry(countryCode);
    
    const query = {
      isActive: true,
      'restrictions.minWeight': { $lte: weight },
      'restrictions.maxWeight': { $gte: weight },
      'restrictions.minOrderAmount': { $lte: totalAmount },
      $or: [
        { 'restrictions.allowedRegions': region },
        { 'restrictions.allowedCountries': countryCode }
      ]
    };

    // Add weight restrictions if weight is provided
    if (weight !== undefined) {
      query['restrictions.minWeight'] = { $lte: weight };
      query['restrictions.maxWeight'] = { $gte: weight };
    }

    // Add order amount restriction if totalAmount is provided
    if (totalAmount !== undefined) {
      query['restrictions.minOrderAmount'] = { $lte: totalAmount };
    }

    // Add region/country restrictions only if countryCode is provided
    if (countryCode) {
      const region = getRegionForCountry(countryCode);
      query.$or = [
        { 'restrictions.allowedRegions': region },
        { 'restrictions.allowedCountries': countryCode.toUpperCase() },
        { 'restrictions.allowedCountries': { $exists: true, $size: 0 } }, // Include methods with no country restrictions
        { 'restrictions.allowedCountries': { $exists: false } } // Include methods with no restrictions defined
      ];
    }

    const shippingMethods = await ShippingMethod.find(query);

    // Calculate costs for each available method
    const shippingMethodsWithCosts = await Promise.all(
      shippingMethods.map(async (method) => {
        try {
          const costDetails = await this.calculateShippingCost(
            method._id,
            orderData
          );
          
          return {
            ...method.toObject(),
            calculatedCost: costDetails
          };
        } catch (error) {
          return null;
        }
      })
    );

    // Filter out methods where cost calculation failed
    return shippingMethodsWithCosts.filter(method => method !== null);
  }
};

module.exports = shippingMethodService;
