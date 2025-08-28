import React, { useState, useEffect } from 'react';

interface PriceData {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
  lastUpdated: string;
}

const PriceRecommendationsPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);

  const crops = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Onion'];
  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Gujarat'];

  const fetchPriceRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/prices?crop=${selectedCrop}&state=${selectedState}`);
      
      if (response.ok) {
        const data = await response.json();
        setPriceData(data);
      } else {
        // Mock data for demo
        const mockData: PriceData[] = [
          {
            crop: selectedCrop || 'Wheat',
            currentPrice: 2200,
            predictedPrice: 2376,
            confidence: 87,
            trend: 'up',
            mandi: 'Ludhiana Mandi',
            lastUpdated: new Date().toLocaleString()
          },
          {
            crop: selectedCrop || 'Rice',
            currentPrice: 3500,
            predictedPrice: 3290,
            confidence: 92,
            trend: 'down',
            mandi: 'Amritsar Mandi',
            lastUpdated: new Date().toLocaleString()
          },
          {
            crop: selectedCrop || 'Maize',
            currentPrice: 1800,
            predictedPrice: 1908,
            confidence: 78,
            trend: 'up',
            mandi: 'Bathinda Mandi',
            lastUpdated: new Date().toLocaleString()
          }
        ];
        setPriceData(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch price data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceRecommendations();
  }, [selectedCrop, selectedState]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Price Recommendations
          </h1>
          <p className="text-gray-600">
            Get AI-powered price predictions and market insights for your crops
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="form-input"
              >
                <option value="">All Crops</option>
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="form-input"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={fetchPriceRecommendations}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Loading...' : 'Update Prices'}
              </button>
            </div>
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {priceData.map((item, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.crop}</h3>
                  <p className="text-sm text-gray-600">{item.mandi}</p>
                </div>
                <div className="text-2xl">{getTrendIcon(item.trend)}</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Price:</span>
                  <span className="font-semibold text-gray-900">₹{item.currentPrice}/quintal</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Predicted Price:</span>
                  <span className={`font-semibold ${getTrendColor(item.trend)}`}>
                    ₹{item.predictedPrice}/quintal
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Change:</span>
                  <span className={`font-semibold ${getTrendColor(item.trend)}`}>
                    {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}
                    ₹{Math.abs(item.predictedPrice - item.currentPrice)} 
                    ({((Math.abs(item.predictedPrice - item.currentPrice) / item.currentPrice) * 100).toFixed(1)}%)
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-semibold text-gray-900">{item.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.confidence}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Last updated: {item.lastUpdated}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Market Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900">Weather Impact</h3>
                <p className="text-sm text-blue-700">
                  Expected rainfall in the next week may impact wheat harvesting schedules. 
                  Consider early harvesting to avoid quality degradation.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-medium text-green-900">Export Demand</h3>
                <p className="text-sm text-green-700">
                  High export demand for basmati rice is driving prices up. 
                  Good time for rice farmers to sell their produce.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-medium text-yellow-900">Storage Alert</h3>
                <p className="text-sm text-yellow-700">
                  Warehouse capacity is reaching limits for wheat storage. 
                  Consider selling or finding alternative storage options.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Price Prediction Factors</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Weather Conditions</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Demand</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Government Policies</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Global Market</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium">70%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRecommendationsPage;
