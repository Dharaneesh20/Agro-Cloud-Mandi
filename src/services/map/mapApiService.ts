import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_MAP_API_URL || 'http://localhost:5000/api';

export interface LocationPoint {
  lat: number;
  lon: number;
}

export interface MapMandi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  type: string;
  rating: number;
  distance?: number;
  commodities: string[];
  operatingHours: string;
  isVerified: boolean;
  facilities?: string[];
}

export interface RouteSegment {
  route: {
    routePoints: LocationPoint[];
  };
}

export interface OptimalRoute {
  routePlan: {
    detailedRoutes: RouteSegment[];
  };
}

export interface PriceRecommendation {
  mandi: MapMandi;
  price: number;
  commodity: string;
  score: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

class MapApiService {
  private api: AxiosInstance;

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
  async geocodeAddress(address: string): Promise<LocationPoint> {
    try {
      const response = await this.api.get('/maps/geocode', {
        params: { address }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await this.api.get('/maps/reverse-geocode', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateRoute(origin: LocationPoint, destination: LocationPoint, routeType: string = 'fastest'): Promise<any> {
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

  async calculateOptimalRoute(origin: LocationPoint, destinations: LocationPoint[], optimize: string = 'time'): Promise<OptimalRoute> {
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

  async searchNearbyPlaces(lat: number, lon: number, query: string = 'market', radius: number = 50000): Promise<any> {
    try {
      const response = await this.api.get('/maps/nearby', {
        params: { lat, lon, query, radius }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async calculateDistanceMatrix(origins: LocationPoint[], destinations: LocationPoint[]): Promise<any> {
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
  async getAllMandis(filters: Record<string, any> = {}): Promise<MapMandi[]> {
    try {
      const response = await this.api.get('/mandis', {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchMandis(query: string): Promise<MapMandi[]> {
    try {
      const response = await this.api.get('/mandis/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNearbyMandis(lat: number, lon: number, radius: number = 100, commodity?: string): Promise<MapMandi[]> {
    try {
      const params: any = { lat, lon, radius };
      if (commodity) params.commodity = commodity;
      
      const response = await this.api.get('/mandis/nearby', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMandiById(id: string): Promise<MapMandi> {
    try {
      const response = await this.api.get(`/mandis/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMandisByCommodity(commodity: string): Promise<MapMandi[]> {
    try {
      const response = await this.api.get(`/mandis/commodity/${commodity}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCommodityPrices(commodity: string): Promise<any> {
    try {
      const response = await this.api.get(`/mandis/prices/${commodity}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPriceRecommendations(
    latitude: number, 
    longitude: number, 
    commodity: string, 
    radius: number = 50
  ): Promise<PriceRecommendation[]> {
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

  async getMarketInsights(commodity?: string): Promise<any> {
    try {
      const params = commodity ? { commodity } : {};
      const response = await this.api.get('/mandis/analytics/insights', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async planMandiRoute(origin: LocationPoint, mandiIds: string[], optimize: string = 'time'): Promise<any> {
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
  private handleError(error: any): ApiError {
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
  async healthCheck(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new MapApiService();
