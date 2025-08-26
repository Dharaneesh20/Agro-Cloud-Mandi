import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Maps API methods
  async geocodeAddress(address) {
    try {
      const response = await this.api.get('/maps/geocode', {
        params: { address }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      const response = await this.api.get('/maps/reverse-geocode', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateRoute(origin, destination, routeType = 'fastest') {
    try {
      const response = await this.api.post('/maps/route', {
        origin,
        destination,
        routeType
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateOptimalRoute(origin, destinations, optimize = 'time') {
    try {
      const response = await this.api.post('/maps/optimal-route', {
        origin,
        destinations,
        optimize
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchNearbyPlaces(lat, lon, query = 'market', radius = 50000) {
    try {
      const response = await this.api.get('/maps/nearby', {
        params: { lat, lon, query, radius }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateDistanceMatrix(origins, destinations) {
    try {
      const response = await this.api.post('/maps/distance-matrix', {
        origins,
        destinations
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mandis API methods
  async getAllMandis(filters = {}) {
    try {
      const response = await this.api.get('/mandis', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchMandis(query) {
    try {
      const response = await this.api.get('/mandis/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNearbyMandis(lat, lon, radius = 100, commodity = null) {
    try {
      const params = { lat, lon, radius };
      if (commodity) params.commodity = commodity;
      
      const response = await this.api.get('/mandis/nearby', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMandiById(id) {
    try {
      const response = await this.api.get(`/mandis/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMandisByCommodity(commodity) {
    try {
      const response = await this.api.get(`/mandis/commodity/${commodity}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCommodityPrices(commodity) {
    try {
      const response = await this.api.get(`/mandis/prices/${commodity}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPriceRecommendations(latitude, longitude, commodity, radius = 50) {
    try {
      const response = await this.api.post('/mandis/price-recommendations', {
        latitude,
        longitude,
        commodity,
        radius
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMarketInsights(commodity = null) {
    try {
      const params = commodity ? { commodity } : {};
      const response = await this.api.get('/mandis/analytics/insights', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async planMandiRoute(origin, mandiIds, optimize = 'time') {
    try {
      const response = await this.api.post('/mandis/route-planning', {
        origin,
        mandiIds,
        optimize
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility method to handle errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data.error || data.message || 'An error occurred',
        details: data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error - please check your connection',
        details: error.request
      };
    } else {
      // Something else happened
      return {
        status: -1,
        message: error.message || 'An unexpected error occurred',
        details: error
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new ApiService();
