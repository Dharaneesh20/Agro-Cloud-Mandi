const axios = require('axios');

class AzureMapsService {
  constructor() {
    this.subscriptionKey = process.env.AZURE_MAPS_SUBSCRIPTION_KEY;
    this.baseUrl = 'https://atlas.microsoft.com';
    
    if (!this.subscriptionKey) {
      console.warn('Azure Maps subscription key not found. Please set AZURE_MAPS_SUBSCRIPTION_KEY in your environment variables.');
    }
  }

  /**
   * Get coordinates (geocoding) for a given address
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/address/json`, {
        params: {
          'api-version': '1.0',
          'subscription-key': this.subscriptionKey,
          query: address,
          countrySet: 'IN' // Focus on India for agricultural mandis
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          latitude: result.position.lat,
          longitude: result.position.lon,
          address: result.address.freeformAddress,
          confidence: result.score
        };
      }
      
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error.message);
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  /**
   * Calculate route between two points
   */
  async calculateRoute(startLat, startLon, endLat, endLon, routeType = 'fastest') {
    try {
      const response = await axios.get(`${this.baseUrl}/route/directions/json`, {
        params: {
          'api-version': '1.0',
          'subscription-key': this.subscriptionKey,
          query: `${startLat},${startLon}:${endLat},${endLon}`,
          routeType: routeType,
          traffic: true,
          travelMode: 'car'
        }
      });

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const summary = route.summary;
        
        return {
          distance: summary.lengthInMeters,
          duration: summary.travelTimeInSeconds,
          distanceText: this.formatDistance(summary.lengthInMeters),
          durationText: this.formatDuration(summary.travelTimeInSeconds),
          routePoints: this.extractRoutePoints(route),
          instructions: this.extractInstructions(route)
        };
      }
      
      throw new Error('Route not found');
    } catch (error) {
      console.error('Route calculation error:', error.message);
      throw new Error(`Failed to calculate route: ${error.message}`);
    }
  }

  /**
   * Calculate route matrix for multiple destinations (for finding shortest routes)
   */
  async calculateRouteMatrix(origins, destinations) {
    try {
      const originsParam = origins.map(o => `${o.lat},${o.lon}`).join(':');
      const destinationsParam = destinations.map(d => `${d.lat},${d.lon}`).join(':');
      
      const response = await axios.get(`${this.baseUrl}/route/matrix/json`, {
        params: {
          'api-version': '1.0',
          'subscription-key': this.subscriptionKey,
          origins: originsParam,
          destinations: destinationsParam,
          travelMode: 'car',
          traffic: true
        }
      });

      return response.data.matrix;
    } catch (error) {
      console.error('Route matrix error:', error.message);
      throw new Error(`Failed to calculate route matrix: ${error.message}`);
    }
  }

  /**
   * Search for nearby places (mandis, markets)
   */
  async searchNearbyPlaces(latitude, longitude, query = 'market', radius = 50000) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/nearby/json`, {
        params: {
          'api-version': '1.0',
          'subscription-key': this.subscriptionKey,
          lat: latitude,
          lon: longitude,
          query: query,
          radius: radius,
          limit: 20
        }
      });

      return response.data.results.map(result => ({
        id: result.id,
        name: result.poi ? result.poi.name : result.address.freeformAddress,
        address: result.address.freeformAddress,
        latitude: result.position.lat,
        longitude: result.position.lon,
        distance: result.dist,
        categories: result.poi ? result.poi.categories : [],
        phone: result.poi && result.poi.phone ? result.poi.phone : null
      }));
    } catch (error) {
      console.error('Nearby search error:', error.message);
      throw new Error(`Failed to search nearby places: ${error.message}`);
    }
  }

  /**
   * Get reverse geocoding (address from coordinates)
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(`${this.baseUrl}/search/address/reverse/json`, {
        params: {
          'api-version': '1.0',
          'subscription-key': this.subscriptionKey,
          query: `${latitude},${longitude}`
        }
      });

      if (response.data.addresses && response.data.addresses.length > 0) {
        const address = response.data.addresses[0].address;
        return {
          formattedAddress: address.freeformAddress,
          street: address.streetName,
          municipality: address.municipality,
          countrySubdivision: address.countrySubdivision,
          postalCode: address.postalCode,
          country: address.country
        };
      }
      
      throw new Error('Address not found for coordinates');
    } catch (error) {
      console.error('Reverse geocoding error:', error.message);
      throw new Error(`Failed to reverse geocode: ${error.message}`);
    }
  }

  // Helper methods
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  extractRoutePoints(route) {
    if (route.legs && route.legs.length > 0) {
      return route.legs[0].points.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude
      }));
    }
    return [];
  }

  extractInstructions(route) {
    if (route.guidance && route.guidance.instructions) {
      return route.guidance.instructions.map(instruction => ({
        text: instruction.message,
        distance: instruction.routeOffsetInMeters
      }));
    }
    return [];
  }
}

module.exports = AzureMapsService;
