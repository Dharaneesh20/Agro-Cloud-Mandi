const express = require('express');
const router = express.Router();
const MandiDataService = require('../services/mandiDataService');
const AzureMapsService = require('../services/azureMapsService');

const mandiData = new MandiDataService();
const azureMaps = new AzureMapsService();

/**
 * @route   GET /api/mandis
 * @desc    Get all mandis with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      state, 
      district, 
      commodity, 
      type, 
      verified, 
      rating_min 
    } = req.query;

    let mandis = mandiData.getAllMandis();

    // Apply filters
    if (state) {
      mandis = mandis.filter(mandi => 
        mandi.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (district) {
      mandis = mandis.filter(mandi => 
        mandi.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (commodity) {
      mandis = mandiData.getMandisByCommodity(commodity);
    }

    if (type) {
      mandis = mandis.filter(mandi => mandi.type === type);
    }

    if (verified !== undefined) {
      const isVerified = verified === 'true';
      mandis = mandis.filter(mandi => mandi.isVerified === isVerified);
    }

    if (rating_min) {
      const minRating = parseFloat(rating_min);
      if (!isNaN(minRating)) {
        mandis = mandis.filter(mandi => mandi.rating >= minRating);
      }
    }

    res.json({
      success: true,
      data: {
        mandis,
        count: mandis.length,
        filters: {
          state,
          district,
          commodity,
          type,
          verified,
          rating_min
        }
      }
    });
  } catch (error) {
    console.error('Error fetching mandis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mandis',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/search
 * @desc    Search mandis by query
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) parameter is required' });
    }

    const results = mandiData.searchMandis(q);
    
    res.json({
      success: true,
      data: {
        query: q,
        results,
        count: results.length
      }
    });
  } catch (error) {
    console.error('Error searching mandis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search mandis',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/nearby
 * @desc    Get mandis near a location
 * @access  Public
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius = 100, commodity } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude (lat) and longitude (lon) parameters are required' 
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadius = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    if (isNaN(searchRadius) || searchRadius > 500) {
      return res.status(400).json({ error: 'Invalid radius. Maximum radius is 500km' });
    }

    let nearbyMandis = mandiData.getNearbyMandis(latitude, longitude, searchRadius);

    // Filter by commodity if specified
    if (commodity) {
      nearbyMandis = nearbyMandis.filter(mandi => 
        mandi.commodities.some(c => c.toLowerCase().includes(commodity.toLowerCase()))
      );
    }

    res.json({
      success: true,
      data: {
        center: { latitude, longitude },
        radius: searchRadius,
        commodity: commodity || 'all',
        mandis: nearbyMandis,
        count: nearbyMandis.length
      }
    });
  } catch (error) {
    console.error('Error finding nearby mandis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearby mandis',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/:id
 * @desc    Get mandi by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mandi = mandiData.getMandiById(id);
    
    if (!mandi) {
      return res.status(404).json({
        success: false,
        error: 'Mandi not found'
      });
    }

    res.json({
      success: true,
      data: mandi
    });
  } catch (error) {
    console.error('Error fetching mandi:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mandi',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/commodity/:commodity
 * @desc    Get mandis that trade a specific commodity
 * @access  Public
 */
router.get('/commodity/:commodity', async (req, res) => {
  try {
    const { commodity } = req.params;
    const mandis = mandiData.getMandisByCommodity(commodity);
    
    res.json({
      success: true,
      data: {
        commodity,
        mandis,
        count: mandis.length
      }
    });
  } catch (error) {
    console.error('Error fetching mandis by commodity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mandis by commodity',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/prices/:commodity
 * @desc    Get price information for a commodity
 * @access  Public
 */
router.get('/prices/:commodity', async (req, res) => {
  try {
    const { commodity } = req.params;
    const priceInfo = mandiData.getCommodityPrice(commodity);
    
    if (!priceInfo) {
      return res.status(404).json({
        success: false,
        error: 'Price information not available for this commodity'
      });
    }

    res.json({
      success: true,
      data: {
        commodity,
        priceInfo,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching commodity prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commodity prices',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/mandis/price-recommendations
 * @desc    Get price recommendations based on location and commodity
 * @access  Public
 */
router.post('/price-recommendations', async (req, res) => {
  try {
    const { latitude, longitude, commodity, radius = 50 } = req.body;
    
    if (!latitude || !longitude || !commodity) {
      return res.status(400).json({ 
        error: 'Latitude, longitude, and commodity are required' 
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    const recommendations = mandiData.getPriceRecommendations(lat, lon, commodity, searchRadius);
    
    if (!recommendations) {
      return res.status(404).json({
        success: false,
        error: 'No price recommendations available for this commodity'
      });
    }

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error generating price recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate price recommendations',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/mandis/insights
 * @desc    Get market insights and analytics
 * @access  Public
 */
router.get('/analytics/insights', async (req, res) => {
  try {
    const { commodity } = req.query;
    const insights = mandiData.getMarketInsights(commodity);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market insights',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/mandis/route-planning
 * @desc    Plan optimal route to visit multiple mandis
 * @access  Public
 */
router.post('/route-planning', async (req, res) => {
  try {
    const { origin, mandiIds, optimize = 'time' } = req.body;
    
    if (!origin || !mandiIds || !Array.isArray(mandiIds)) {
      return res.status(400).json({ 
        error: 'Origin coordinates and mandiIds array are required' 
      });
    }

    if (mandiIds.length === 0) {
      return res.status(400).json({ error: 'At least one mandi ID is required' });
    }

    if (mandiIds.length > 10) {
      return res.status(400).json({ 
        error: 'Maximum 10 mandis allowed for route planning' 
      });
    }

    // Get mandi details
    const mandis = [];
    for (const id of mandiIds) {
      const mandi = mandiData.getMandiById(id);
      if (!mandi) {
        return res.status(404).json({
          success: false,
          error: `Mandi with ID ${id} not found`
        });
      }
      mandis.push({
        ...mandi,
        lat: mandi.latitude,
        lon: mandi.longitude
      });
    }

    // Calculate optimal route using maps API
    try {
      const routeResponse = await fetch(`${req.protocol}://${req.get('host')}/api/maps/optimal-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destinations: mandis,
          optimize
        }),
      });

      const routeData = await routeResponse.json();

      if (!routeData.success) {
        throw new Error(routeData.error || 'Failed to calculate optimal route');
      }

      res.json({
        success: true,
        data: {
          origin,
          mandis,
          routePlan: routeData.data,
          optimization: optimize
        }
      });
    } catch (routeError) {
      console.error('Route calculation error:', routeError);
      
      // Fallback: return mandis sorted by distance
      const nearbyMandis = mandis.map(mandi => ({
        ...mandi,
        distance: mandiData.calculateDistance(origin.lat, origin.lon, mandi.latitude, mandi.longitude)
      })).sort((a, b) => a.distance - b.distance);

      res.json({
        success: true,
        data: {
          origin,
          mandis: nearbyMandis,
          routePlan: {
            route: [origin, ...nearbyMandis],
            totalDistance: nearbyMandis.reduce((sum, m) => sum + m.distance, 0) * 1000,
            optimization: 'distance_fallback'
          },
          warning: 'Used fallback route calculation due to mapping service error'
        }
      });
    }
  } catch (error) {
    console.error('Error in route planning:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to plan route',
      message: error.message
    });
  }
});

module.exports = router;
