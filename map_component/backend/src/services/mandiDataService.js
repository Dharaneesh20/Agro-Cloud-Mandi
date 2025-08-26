// Mock data for agricultural mandis in India
class MandiDataService {
  constructor() {
    this.mandis = [
      // Major Agricultural Mandis across India
      {
        id: 'mandi_001',
        name: 'Azadpur Mandi',
        address: 'Azadpur, Delhi, India',
        latitude: 28.7041,
        longitude: 77.1025,
        state: 'Delhi',
        district: 'North Delhi',
        type: 'wholesale',
        commodities: ['wheat', 'rice', 'vegetables', 'fruits'],
        facilities: ['storage', 'cold_storage', 'transport', 'auction_hall'],
        operatingHours: '04:00-14:00',
        contact: '+91-11-2766-5432',
        priceRange: 'medium',
        rating: 4.2,
        marketFee: 2.5,
        isVerified: true
      },
      {
        id: 'mandi_002',
        name: 'Koyambedu Market',
        address: 'Koyambedu, Chennai, Tamil Nadu, India',
        latitude: 13.0732,
        longitude: 80.1986,
        state: 'Tamil Nadu',
        district: 'Chennai',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits', 'flowers'],
        facilities: ['storage', 'cold_storage', 'transport', 'auction_hall', 'processing'],
        operatingHours: '02:00-12:00',
        contact: '+91-44-2679-5432',
        priceRange: 'medium',
        rating: 4.5,
        marketFee: 2.0,
        isVerified: true
      },
      {
        id: 'mandi_003',
        name: 'Lasalgaon Onion Market',
        address: 'Lasalgaon, Nashik, Maharashtra, India',
        latitude: 20.1467,
        longitude: 74.2411,
        state: 'Maharashtra',
        district: 'Nashik',
        type: 'specialty',
        commodities: ['onion', 'potato', 'tomato'],
        facilities: ['storage', 'grading', 'transport', 'auction_hall'],
        operatingHours: '06:00-18:00',
        contact: '+91-253-234-5678',
        priceRange: 'high',
        rating: 4.1,
        marketFee: 3.0,
        isVerified: true
      },
      {
        id: 'mandi_004',
        name: 'Vashi APMC Market',
        address: 'Vashi, Navi Mumbai, Maharashtra, India',
        latitude: 19.0728,
        longitude: 73.0117,
        state: 'Maharashtra',
        district: 'Thane',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits', 'grains', 'spices'],
        facilities: ['storage', 'cold_storage', 'transport', 'auction_hall', 'processing'],
        operatingHours: '04:00-16:00',
        contact: '+91-22-2789-1234',
        priceRange: 'medium',
        rating: 4.3,
        marketFee: 2.5,
        isVerified: true
      },
      {
        id: 'mandi_005',
        name: 'Gaddiannaram Rythu Bazaar',
        address: 'Gaddiannaram, Hyderabad, Telangana, India',
        latitude: 17.3297,
        longitude: 78.5437,
        state: 'Telangana',
        district: 'Hyderabad',
        type: 'retail',
        commodities: ['vegetables', 'fruits', 'grains'],
        facilities: ['storage', 'transport', 'retail_stalls'],
        operatingHours: '06:00-20:00',
        contact: '+91-40-2345-6789',
        priceRange: 'low',
        rating: 3.9,
        marketFee: 1.5,
        isVerified: true
      },
      {
        id: 'mandi_006',
        name: 'Yeshwantpur Market',
        address: 'Yeshwantpur, Bangalore, Karnataka, India',
        latitude: 13.0206,
        longitude: 77.5391,
        state: 'Karnataka',
        district: 'Bangalore Urban',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits', 'flowers'],
        facilities: ['storage', 'cold_storage', 'transport', 'auction_hall'],
        operatingHours: '03:00-11:00',
        contact: '+91-80-2345-6789',
        priceRange: 'medium',
        rating: 4.0,
        marketFee: 2.0,
        isVerified: true
      },
      {
        id: 'mandi_007',
        name: 'Kalimati Fruit and Vegetable Market',
        address: 'Kalimati, Kathmandu, Nepal',
        latitude: 27.6944,
        longitude: 85.2958,
        state: 'Bagmati',
        district: 'Kathmandu',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits'],
        facilities: ['storage', 'transport', 'auction_hall'],
        operatingHours: '04:00-12:00',
        contact: '+977-1-234-5678',
        priceRange: 'low',
        rating: 3.8,
        marketFee: 2.0,
        isVerified: false
      },
      {
        id: 'mandi_008',
        name: 'Mandideep Agricultural Market',
        address: 'Mandideep, Raisen, Madhya Pradesh, India',
        latitude: 23.0795,
        longitude: 77.5322,
        state: 'Madhya Pradesh',
        district: 'Raisen',
        type: 'wholesale',
        commodities: ['wheat', 'rice', 'soybean', 'cotton'],
        facilities: ['storage', 'grading', 'transport', 'auction_hall'],
        operatingHours: '06:00-16:00',
        contact: '+91-755-234-5678',
        priceRange: 'medium',
        rating: 4.1,
        marketFee: 2.5,
        isVerified: true
      },
      {
        id: 'mandi_009',
        name: 'Aluva Vegetable Market',
        address: 'Aluva, Ernakulam, Kerala, India',
        latitude: 10.1080,
        longitude: 76.3533,
        state: 'Kerala',
        district: 'Ernakulam',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits', 'spices', 'coconut'],
        facilities: ['storage', 'transport', 'auction_hall'],
        operatingHours: '05:00-13:00',
        contact: '+91-484-234-5678',
        priceRange: 'medium',
        rating: 3.9,
        marketFee: 2.0,
        isVerified: true
      },
      {
        id: 'mandi_010',
        name: 'Siliguri Regulated Market',
        address: 'Siliguri, Darjeeling, West Bengal, India',
        latitude: 26.7271,
        longitude: 88.3953,
        state: 'West Bengal',
        district: 'Darjeeling',
        type: 'wholesale',
        commodities: ['vegetables', 'fruits', 'tea', 'rice'],
        facilities: ['storage', 'cold_storage', 'transport', 'auction_hall'],
        operatingHours: '05:00-15:00',
        contact: '+91-353-234-5678',
        priceRange: 'low',
        rating: 3.7,
        marketFee: 1.8,
        isVerified: true
      }
    ];

    // Mock price data for different commodities
    this.priceData = {
      wheat: { min: 2100, max: 2400, unit: 'per quintal', trend: 'stable' },
      rice: { min: 2800, max: 3200, unit: 'per quintal', trend: 'increasing' },
      onion: { min: 15, max: 45, unit: 'per kg', trend: 'volatile' },
      potato: { min: 8, max: 18, unit: 'per kg', trend: 'stable' },
      tomato: { min: 12, max: 35, unit: 'per kg', trend: 'increasing' },
      vegetables: { min: 10, max: 40, unit: 'per kg', trend: 'stable' },
      fruits: { min: 20, max: 80, unit: 'per kg', trend: 'stable' },
      cotton: { min: 5200, max: 5800, unit: 'per quintal', trend: 'increasing' },
      soybean: { min: 3800, max: 4200, unit: 'per quintal', trend: 'stable' }
    };
  }

  /**
   * Get all mandis
   */
  getAllMandis() {
    return this.mandis;
  }

  /**
   * Search mandis by location (state, district, or name)
   */
  searchMandis(query) {
    const searchTerm = query.toLowerCase();
    return this.mandis.filter(mandi => 
      mandi.name.toLowerCase().includes(searchTerm) ||
      mandi.state.toLowerCase().includes(searchTerm) ||
      mandi.district.toLowerCase().includes(searchTerm) ||
      mandi.address.toLowerCase().includes(searchTerm) ||
      mandi.commodities.some(commodity => commodity.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get mandis by commodity
   */
  getMandisByCommodity(commodity) {
    const searchCommodity = commodity.toLowerCase();
    return this.mandis.filter(mandi => 
      mandi.commodities.some(c => c.toLowerCase().includes(searchCommodity))
    );
  }

  /**
   * Get mandis within a certain radius of coordinates
   */
  getNearbyMandis(latitude, longitude, radiusKm = 100) {
    return this.mandis.filter(mandi => {
      const distance = this.calculateDistance(latitude, longitude, mandi.latitude, mandi.longitude);
      return distance <= radiusKm;
    }).map(mandi => ({
      ...mandi,
      distance: this.calculateDistance(latitude, longitude, mandi.latitude, mandi.longitude)
    })).sort((a, b) => a.distance - b.distance);
  }

  /**
   * Get mandi by ID
   */
  getMandiById(id) {
    return this.mandis.find(mandi => mandi.id === id);
  }

  /**
   * Get price information for a commodity
   */
  getCommodityPrice(commodity) {
    const searchCommodity = commodity.toLowerCase();
    return this.priceData[searchCommodity] || null;
  }

  /**
   * Get price recommendations based on location and commodity
   */
  getPriceRecommendations(latitude, longitude, commodity, radiusKm = 50) {
    const nearbyMandis = this.getNearbyMandis(latitude, longitude, radiusKm);
    const relevantMandis = nearbyMandis.filter(mandi => 
      mandi.commodities.some(c => c.toLowerCase().includes(commodity.toLowerCase()))
    );

    const basePrice = this.getCommodityPrice(commodity);
    if (!basePrice) {
      return null;
    }

    return {
      commodity: commodity,
      basePrice: basePrice,
      recommendedMandis: relevantMandis.slice(0, 5).map(mandi => ({
        ...mandi,
        estimatedPrice: this.calculateEstimatedPrice(basePrice, mandi.priceRange, mandi.marketFee),
        marketAdvantage: this.calculateMarketAdvantage(mandi)
      })),
      priceAnalysis: {
        averagePrice: (basePrice.min + basePrice.max) / 2,
        priceRange: `₹${basePrice.min} - ₹${basePrice.max}`,
        trend: basePrice.trend,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Calculate estimated price based on market characteristics
   */
  calculateEstimatedPrice(basePrice, priceRange, marketFee) {
    const avgPrice = (basePrice.min + basePrice.max) / 2;
    let multiplier = 1;

    switch (priceRange) {
      case 'high':
        multiplier = 1.1;
        break;
      case 'medium':
        multiplier = 1.0;
        break;
      case 'low':
        multiplier = 0.9;
        break;
    }

    const estimatedPrice = avgPrice * multiplier;
    const finalPrice = estimatedPrice - (estimatedPrice * marketFee / 100);

    return {
      estimatedPrice: Math.round(estimatedPrice),
      afterFees: Math.round(finalPrice),
      marketFee: marketFee,
      unit: basePrice.unit
    };
  }

  /**
   * Calculate market advantage score
   */
  calculateMarketAdvantage(mandi) {
    let score = 0;
    
    // Rating component (40% weight)
    score += (mandi.rating / 5) * 40;
    
    // Price range component (30% weight)
    const priceScore = mandi.priceRange === 'high' ? 30 : 
                      mandi.priceRange === 'medium' ? 20 : 10;
    score += priceScore;
    
    // Facilities component (20% weight)
    score += (mandi.facilities.length / 6) * 20;
    
    // Verification component (10% weight)
    score += mandi.isVerified ? 10 : 0;

    return Math.round(score);
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * Get market insights and analytics
   */
  getMarketInsights(commodity = null) {
    const insights = {
      totalMandis: this.mandis.length,
      verifiedMandis: this.mandis.filter(m => m.isVerified).length,
      averageRating: (this.mandis.reduce((sum, m) => sum + m.rating, 0) / this.mandis.length).toFixed(1),
      stateDistribution: this.getStateDistribution(),
      commodityPopularity: this.getCommodityPopularity(),
      marketTypes: this.getMarketTypeDistribution()
    };

    if (commodity) {
      const commodityMandis = this.getMandisByCommodity(commodity);
      insights.commoditySpecific = {
        availableMandis: commodityMandis.length,
        topRatedMandis: commodityMandis
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(m => ({ name: m.name, rating: m.rating, state: m.state })),
        priceInfo: this.getCommodityPrice(commodity)
      };
    }

    return insights;
  }

  getStateDistribution() {
    const distribution = {};
    this.mandis.forEach(mandi => {
      distribution[mandi.state] = (distribution[mandi.state] || 0) + 1;
    });
    return distribution;
  }

  getCommodityPopularity() {
    const popularity = {};
    this.mandis.forEach(mandi => {
      mandi.commodities.forEach(commodity => {
        popularity[commodity] = (popularity[commodity] || 0) + 1;
      });
    });
    return Object.entries(popularity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
  }

  getMarketTypeDistribution() {
    const distribution = {};
    this.mandis.forEach(mandi => {
      distribution[mandi.type] = (distribution[mandi.type] || 0) + 1;
    });
    return distribution;
  }
}

module.exports = MandiDataService;
