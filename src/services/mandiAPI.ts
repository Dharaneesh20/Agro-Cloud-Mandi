import api from './api';

export interface Mandi {
  id: string;
  name: string;
  location: {
    district: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
  distance?: number;
  activeTraders: number;
  commodities: string[];
  avgPrice: number;
  rating: number;
  facilities: string[];
  operatingHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  contact: {
    phone?: string;
    email?: string;
  };
}

export interface MandiQuery {
  location?: {
    lat: number;
    lng: number;
  };
  maxDistance?: number;
  commodity?: string;
  minRating?: number;
  state?: string;
  district?: string;
}

export interface TraderInfo {
  id: string;
  name: string;
  businessName: string;
  specialization: string[];
  rating: number;
  contact: {
    phone: string;
    email: string;
  };
  isVerified: boolean;
}

export const mandiAPI = {
  // Get nearby mandis
  getNearbyMandis: async (query: MandiQuery): Promise<Mandi[]> => {
    try {
      const response = await api.get('/mandis/nearby', { params: query });
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return [
        {
          id: '1',
          name: 'Ludhiana Grain Market',
          location: {
            district: 'Ludhiana',
            state: 'Punjab',
            coordinates: { lat: 30.901, lng: 75.857 },
            address: 'Grain Market Road, Ludhiana, Punjab'
          },
          distance: 12,
          activeTraders: 45,
          commodities: ['Wheat', 'Rice', 'Maize'],
          avgPrice: 2200,
          rating: 4.5,
          facilities: ['Storage', 'Transport', 'Quality Testing', 'Banking'],
          operatingHours: {
            open: '06:00',
            close: '18:00',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          contact: {
            phone: '+91-9876543210',
            email: 'info@ludhianamandi.com'
          }
        },
        {
          id: '2',
          name: 'Amritsar Agricultural Mandi',
          location: {
            district: 'Amritsar',
            state: 'Punjab',
            coordinates: { lat: 31.634, lng: 74.872 },
            address: 'Agricultural Market, Amritsar, Punjab'
          },
          distance: 18,
          activeTraders: 32,
          commodities: ['Rice', 'Wheat', 'Cotton'],
          avgPrice: 3500,
          rating: 4.2,
          facilities: ['Storage', 'Transport', 'Banking'],
          operatingHours: {
            open: '06:00',
            close: '17:00',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          },
          contact: {
            phone: '+91-9876543211',
            email: 'contact@amritsarmandi.com'
          }
        },
        {
          id: '3',
          name: 'Bathinda Mandi',
          location: {
            district: 'Bathinda',
            state: 'Punjab',
            coordinates: { lat: 30.211, lng: 74.945 },
            address: 'Market Yard, Bathinda, Punjab'
          },
          distance: 25,
          activeTraders: 28,
          commodities: ['Cotton', 'Wheat', 'Sugarcane'],
          avgPrice: 1800,
          rating: 4.0,
          facilities: ['Storage', 'Quality Testing'],
          operatingHours: {
            open: '06:30',
            close: '17:30',
            daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          },
          contact: {
            phone: '+91-9876543212'
          }
        }
      ];
    }
  },

  // Get mandi details by ID
  getMandiDetails: async (mandiId: string): Promise<Mandi> => {
    try {
      const response = await api.get(`/mandis/${mandiId}`);
      return response.data;
    } catch (error) {
      throw new Error('Mandi not found');
    }
  },

  // Get traders in a mandi
  getMandiTraders: async (mandiId: string): Promise<TraderInfo[]> => {
    try {
      const response = await api.get(`/mandis/${mandiId}/traders`);
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        {
          id: '1',
          name: 'Rajesh Kumar',
          businessName: 'Kumar Grain Traders',
          specialization: ['Wheat', 'Rice'],
          rating: 4.6,
          contact: {
            phone: '+91-9876543220',
            email: 'rajesh@kumartraders.com'
          },
          isVerified: true
        },
        {
          id: '2',
          name: 'Suresh Singh',
          businessName: 'Punjab Agro Corp',
          specialization: ['Rice', 'Cotton'],
          rating: 4.3,
          contact: {
            phone: '+91-9876543221',
            email: 'suresh@punjabagro.com'
          },
          isVerified: true
        }
      ];
    }
  },

  // Get current prices at a mandi
  getMandiPrices: async (mandiId: string): Promise<Array<{ crop: string; price: number; lastUpdated: string }>> => {
    try {
      const response = await api.get(`/mandis/${mandiId}/prices`);
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        { crop: 'Wheat', price: 2200, lastUpdated: new Date().toISOString() },
        { crop: 'Rice', price: 3500, lastUpdated: new Date().toISOString() },
        { crop: 'Maize', price: 1800, lastUpdated: new Date().toISOString() }
      ];
    }
  },

  // Search mandis by name or location
  searchMandis: async (searchTerm: string): Promise<Mandi[]> => {
    try {
      const response = await api.get('/mandis/search', { params: { q: searchTerm } });
      return response.data;
    } catch (error) {
      // Return filtered mock data
      const allMandis = await mandiAPI.getNearbyMandis({});
      return allMandis.filter(mandi => 
        mandi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mandi.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mandi.location.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  },

  // Get directions to a mandi
  getDirections: async (mandiId: string, userLocation: { lat: number; lng: number }): Promise<any> => {
    try {
      const response = await api.get(`/mandis/${mandiId}/directions`, { params: userLocation });
      return response.data;
    } catch (error) {
      // Return mock directions data
      return {
        duration: '45 minutes',
        distance: '25 km',
        route: 'Via NH-1 and SH-2',
        steps: [
          'Head north on Main Road',
          'Turn right on NH-1',
          'Continue for 20 km',
          'Turn left on SH-2',
          'Destination will be on your right'
        ]
      };
    }
  },

  // Get mandi facilities and services
  getMandiFacilities: async (mandiId: string): Promise<Array<{ name: string; available: boolean; description: string }>> => {
    try {
      const response = await api.get(`/mandis/${mandiId}/facilities`);
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        { name: 'Storage', available: true, description: 'Warehouse facilities for crop storage' },
        { name: 'Transport', available: true, description: 'Loading and transportation services' },
        { name: 'Quality Testing', available: true, description: 'Crop quality analysis and grading' },
        { name: 'Banking', available: true, description: 'Payment and banking services' },
        { name: 'Insurance', available: false, description: 'Crop insurance services' }
      ];
    }
  },

  // Get market calendar/events
  getMarketCalendar: async (mandiId: string): Promise<Array<{ date: string; event: string; description: string }>> => {
    try {
      const response = await api.get(`/mandis/${mandiId}/calendar`);
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        {
          date: '2024-02-15',
          event: 'Wheat Auction',
          description: 'Special auction for premium wheat varieties'
        },
        {
          date: '2024-02-20',
          event: 'Rice Quality Fair',
          description: 'Exhibition of different rice qualities and varieties'
        },
        {
          date: '2024-02-25',
          event: 'Farmer Training',
          description: 'Training session on modern farming techniques'
        }
      ];
    }
  }
};
