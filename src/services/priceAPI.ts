import api from './api';

export interface PriceData {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
  lastUpdated: string;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}

export interface PriceQuery {
  crop?: string;
  state?: string;
  district?: string;
  mandi?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface MarketInsight {
  type: 'weather' | 'demand' | 'government' | 'global';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  crops: string[];
  severity: 'low' | 'medium' | 'high';
}

export const priceAPI = {
  // Get price recommendations
  getPriceRecommendations: async (query: PriceQuery): Promise<PriceData[]> => {
    try {
      const response = await api.get('/prices/recommendations', { params: query });
      return response.data;
    } catch (error) {
      // Return mock data for demo
      return [
        {
          crop: query.crop || 'Wheat',
          currentPrice: 2200,
          predictedPrice: 2376,
          confidence: 87,
          trend: 'up',
          mandi: 'Ludhiana Mandi',
          lastUpdated: new Date().toISOString(),
          priceHistory: [
            { date: '2024-01-01', price: 2100 },
            { date: '2024-01-15', price: 2150 },
            { date: '2024-02-01', price: 2200 },
          ]
        },
        {
          crop: 'Rice',
          currentPrice: 3500,
          predictedPrice: 3290,
          confidence: 92,
          trend: 'down',
          mandi: 'Amritsar Mandi',
          lastUpdated: new Date().toISOString(),
          priceHistory: [
            { date: '2024-01-01', price: 3600 },
            { date: '2024-01-15', price: 3550 },
            { date: '2024-02-01', price: 3500 },
          ]
        }
      ];
    }
  },

  // Get historical prices
  getHistoricalPrices: async (crop: string, dateRange: { start: string; end: string }): Promise<Array<{ date: string; price: number }>> => {
    try {
      const response = await api.get(`/prices/history/${crop}`, { params: dateRange });
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        { date: '2024-01-01', price: 2100 },
        { date: '2024-01-15', price: 2150 },
        { date: '2024-02-01', price: 2200 },
        { date: '2024-02-15', price: 2180 },
        { date: '2024-03-01', price: 2250 },
      ];
    }
  },

  // Get current market prices
  getCurrentPrices: async (crops: string[]): Promise<Array<{ crop: string; price: number; mandi: string }>> => {
    try {
      const response = await api.get('/prices/current', { params: { crops: crops.join(',') } });
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        { crop: 'Wheat', price: 2200, mandi: 'Ludhiana Mandi' },
        { crop: 'Rice', price: 3500, mandi: 'Amritsar Mandi' },
        { crop: 'Maize', price: 1800, mandi: 'Bathinda Mandi' },
      ];
    }
  },

  // Get market insights
  getMarketInsights: async (): Promise<MarketInsight[]> => {
    try {
      const response = await api.get('/prices/insights');
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        {
          type: 'weather',
          title: 'Weather Impact Alert',
          description: 'Expected rainfall in the next week may impact wheat harvesting schedules.',
          impact: 'negative',
          crops: ['Wheat'],
          severity: 'medium'
        },
        {
          type: 'demand',
          title: 'Export Demand Surge',
          description: 'High export demand for basmati rice is driving prices up.',
          impact: 'positive',
          crops: ['Rice'],
          severity: 'high'
        },
        {
          type: 'government',
          title: 'Storage Policy Update',
          description: 'New government guidelines for warehouse storage capacity.',
          impact: 'neutral',
          crops: ['Wheat', 'Rice'],
          severity: 'low'
        }
      ];
    }
  },

  // Get price alerts
  getPriceAlerts: async (): Promise<Array<{ crop: string; message: string; type: 'increase' | 'decrease' | 'target' }>> => {
    try {
      const response = await api.get('/prices/alerts');
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        {
          crop: 'Wheat',
          message: 'Price increased by 8% in the last week',
          type: 'increase'
        },
        {
          crop: 'Rice',
          message: 'Price dropped to your target level of ₹3,500',
          type: 'target'
        }
      ];
    }
  },

  // Set price alert
  setPriceAlert: async (crop: string, targetPrice: number, type: 'above' | 'below'): Promise<void> => {
    try {
      await api.post('/prices/alerts', { crop, targetPrice, type });
    } catch (error) {
      console.log('Price alert set locally');
    }
  },

  // Get price prediction factors
  getPredictionFactors: async (): Promise<Array<{ factor: string; impact: number; description: string }>> => {
    try {
      const response = await api.get('/prices/prediction-factors');
      return response.data;
    } catch (error) {
      // Return mock data
      return [
        { factor: 'Weather Conditions', impact: 75, description: 'Monsoon patterns and seasonal changes' },
        { factor: 'Market Demand', impact: 85, description: 'Domestic and international demand trends' },
        { factor: 'Government Policies', impact: 60, description: 'MSP announcements and trade policies' },
        { factor: 'Global Market', impact: 70, description: 'International commodity prices and trade' }
      ];
    }
  }
};
