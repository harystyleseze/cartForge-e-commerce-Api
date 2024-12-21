const regionMap = {
    // North America
    'US': 'domestic',
    'CA': 'north-america',
    'MX': 'north-america',
    
    // Europe
    'GB': 'europe',
    'FR': 'europe',
    'DE': 'europe',
    'IT': 'europe',
    'ES': 'europe',
    // ... add more countries
    
    // Asia
    'CN': 'asia',
    'JP': 'asia',
    'KR': 'asia',
    'IN': 'asia',
    // ... add more countries
    
    // Add more regions and countries as needed
  };
  
  const getRegionForCountry = (countryCode) => {
    return regionMap[countryCode.toUpperCase()] || 'international';
  };
  
  module.exports = { getRegionForCountry };