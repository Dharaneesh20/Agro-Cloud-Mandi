const express = require('express');
const router = express.Router();
const AzureMapsService = require('../services/azureMapsService');
const RouteOptimizationService = require('../services/routeOptimizationService');

const azureMaps = new AzureMapsService();
const routeOptimization = new RouteOptimizationService();

/**
 * @route   GET /api/maps/geocode
 * @desc    Get coordinates for an address
 * @access  Public
 */
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const result = await azureMaps.geocodeAddress(address);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to geocode address',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/maps/reverse-geocode
 * @desc    Get address from coordinates
 * @access  Public
 */
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    const result = await azureMaps.reverseGeocode(latitude, longitude);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reverse geocode coordinates',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/maps/route
 * @desc    Calculate route between two points
 * @access  Public
 */
router.post('/route', async (req, res) => {
  try {
    const { origin, destination, routeType = 'fastest' } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    if (!origin.lat || !origin.lon || !destination.lat || !destination.lon) {
      return res.status(400).json({ 
        error: 'Origin and destination must include lat and lon coordinates' 
      });
    }

    const result = await azureMaps.calculateRoute(
      origin.lat, 
      origin.lon, 
      destination.lat, 
      destination.lon, 
      routeType
    );

    res.json({
      success: true,
      data: {
        origin,
        destination,
        route: result,
        routeType
      }
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate route',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/maps/optimal-route
 * @desc    Find optimal route visiting multiple destinations
 * @access  Public
 */
router.post('/optimal-route', async (req, res) => {
  try {
    const { origin, destinations, optimize = 'time' } = req.body;
    
    if (!origin || !destinations || !Array.isArray(destinations)) {
      return res.status(400).json({ 
        error: 'Origin and destinations array are required' 
      });
    }

    if (destinations.length === 0) {
      return res.status(400).json({ error: 'At least one destination is required' });
    }

    if (destinations.length > 10) {
      return res.status(400).json({ 
        error: 'Maximum 10 destinations allowed for optimal route calculation' 
      });
    }

    // Validate coordinates
    const allPoints = [origin, ...destinations];
    for (const point of allPoints) {
      if (!point.lat || !point.lon) {
        return res.status(400).json({ 
          error: 'All points must include lat and lon coordinates' 
        });
      }
    }

    // Calculate route matrix
    const routeMatrix = await azureMaps.calculateRouteMatrix([origin], destinations);
    
    // Find optimal route
    const optimalRoute = routeOptimization.findOptimalRoute(origin, destinations, routeMatrix);

    // Calculate detailed routes for each segment
    const detailedRoutes = [];
    for (let i = 0; i < optimalRoute.route.length - 1; i++) {
      const start = optimalRoute.route[i];
      const end = optimalRoute.route[i + 1];
      
      try {
        const segmentRoute = await azureMaps.calculateRoute(
          start.lat || start.latitude, 
          start.lon || start.longitude, 
          end.lat || end.latitude, 
          end.lon || end.longitude
        );
        detailedRoutes.push({
          from: start,
          to: end,
          route: segmentRoute
        });
      } catch (segmentError) {
        console.warn('Failed to get detailed route for segment:', segmentError.message);
      }
    }

    // Calculate efficiency metrics
    const efficiency = routeOptimization.calculateRouteEfficiency(
      optimalRoute.route, 
      optimalRoute.totalDistance, 
      optimalRoute.totalTime
    );

    res.json({
      success: true,
      data: {
        origin,
        destinations,
        optimalRoute: {
          ...optimalRoute,
          efficiency,
          detailedRoutes
        },
        optimization: {
          criteria: optimize,
          totalStops: optimalRoute.route.length - 1,
          algorithm: optimalRoute.optimizationMethod
        }
      }
    });
  } catch (error) {
    console.error('Optimal route calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate optimal route',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/maps/nearby
 * @desc    Search for nearby places
 * @access  Public
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, query = 'market', radius = 50000 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadius = parseInt(radius);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    if (isNaN(searchRadius) || searchRadius > 100000) {
      return res.status(400).json({ error: 'Invalid radius. Maximum radius is 100km (100000 meters)' });
    }

    const results = await azureMaps.searchNearbyPlaces(latitude, longitude, query, searchRadius);
    
    res.json({
      success: true,
      data: {
        center: { latitude, longitude },
        searchQuery: query,
        radius: searchRadius,
        results: results,
        count: results.length
      }
    });
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search nearby places',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/maps/distance-matrix
 * @desc    Calculate distance and time matrix between multiple points
 * @access  Public
 */
router.post('/distance-matrix', async (req, res) => {
  try {
    const { origins, destinations } = req.body;
    
    if (!origins || !destinations || !Array.isArray(origins) || !Array.isArray(destinations)) {
      return res.status(400).json({ 
        error: 'Origins and destinations arrays are required' 
      });
    }

    if (origins.length === 0 || destinations.length === 0) {
      return res.status(400).json({ 
        error: 'At least one origin and one destination are required' 
      });
    }

    if (origins.length > 25 || destinations.length > 25) {
      return res.status(400).json({ 
        error: 'Maximum 25 origins and 25 destinations allowed' 
      });
    }

    // Validate coordinates
    const allPoints = [...origins, ...destinations];
    for (const point of allPoints) {
      if (!point.lat || !point.lon) {
        return res.status(400).json({ 
          error: 'All points must include lat and lon coordinates' 
        });
      }
    }

    const matrix = await azureMaps.calculateRouteMatrix(origins, destinations);
    
    res.json({
      success: true,
      data: {
        origins,
        destinations,
        matrix,
        matrixSize: `${origins.length}x${destinations.length}`
      }
    });
  } catch (error) {
    console.error('Distance matrix calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate distance matrix',
      message: error.message
    });
  }
});

module.exports = router;
