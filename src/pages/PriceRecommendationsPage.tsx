import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatBot from '../components/ChatBot';

interface PriceData {
  crop: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
  mandiId: string;
  state: string;
  lastUpdated: string;
  volume: number;
  quality: 'Premium' | 'Standard' | 'Basic';
}

interface MarketComparison {
  crop: string;
  markets: {
    mandiId: string;
    mandi: string;
    state: string;
    price: number;
    volume: number;
    quality: string;
    distance: number;
  }[];
}

const PriceRecommendationsPage: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['ludhiana', 'amritsar']);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [marketComparison, setMarketComparison] = useState<MarketComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'comparison'>('grid');

  const crops = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Onion', 'Mustard', 'Barley'];
  
  const availableMarkets = [
    { id: 'ludhiana', name: 'Ludhiana Mandi', state: 'Punjab', distance: 0 },
    { id: 'amritsar', name: 'Amritsar Mandi', state: 'Punjab', distance: 45 },
    { id: 'bathinda', name: 'Bathinda Mandi', state: 'Punjab', distance: 120 },
    { id: 'chandigarh', name: 'Chandigarh Mandi', state: 'Chandigarh', distance: 85 },
    { id: 'hisar', name: 'Hisar Mandi', state: 'Haryana', distance: 180 },
    { id: 'karnal', name: 'Karnal Mandi', state: 'Haryana', distance: 150 },
    { id: 'rohtak', name: 'Rohtak Mandi', state: 'Haryana', distance: 200 },
    { id: 'meerut', name: 'Meerut Mandi', state: 'Uttar Pradesh', distance: 320 },
  ];

  const fetchPriceData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockData: PriceData[] = selectedMarkets.map((marketId, index) => {
        const market = availableMarkets.find(m => m.id === marketId);
        const basePrice = getCropBasePrice(selectedCrop);
        const variation = (Math.random() - 0.5) * 400; // ±200 variation
        const currentPrice = Math.round(basePrice + variation);
        const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable';
        const predictedChange = trend === 'up' ? Math.random() * 200 : trend === 'down' ? -Math.random() * 200 : 0;
        
        return {
          crop: selectedCrop,
          currentPrice,
          predictedPrice: Math.round(currentPrice + predictedChange),
          confidence: Math.round(75 + Math.random() * 20),
          trend,
          mandi: market?.name || 'Unknown Mandi',
          mandiId: marketId,
          state: market?.state || 'Unknown',
          lastUpdated: new Date().toLocaleString(),
          volume: Math.round(100 + Math.random() * 500),
          quality: ['Premium', 'Standard', 'Basic'][Math.floor(Math.random() * 3)] as 'Premium' | 'Standard' | 'Basic'
        };
      });
      
      setPriceData(mockData);
      
      // Create market comparison
      const comparison: MarketComparison = {
        crop: selectedCrop,
        markets: mockData.map(data => ({
          mandiId: data.mandiId,
          mandi: data.mandi,
          state: data.state,
          price: data.currentPrice,
          volume: data.volume,
          quality: data.quality,
          distance: availableMarkets.find(m => m.id === data.mandiId)?.distance || 0
        }))
      };
      
      setMarketComparison(comparison);
    } catch (error) {
      console.error('Failed to fetch price data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCropBasePrice = (crop: string): number => {
    const basePrices: { [key: string]: number } = {
      'Wheat': 2200,
      'Rice': 3500,
      'Maize': 1800,
      'Sugarcane': 350,
      'Cotton': 5500,
      'Soybean': 4200,
      'Potato': 1200,
      'Onion': 1500,
      'Mustard': 4800,
      'Barley': 1900
    };
    return basePrices[crop] || 2000;
  };

  useEffect(() => {
    fetchPriceData();
  }, [selectedCrop, selectedMarkets]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />;
      case 'down': return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
      default: return <div className="h-5 w-5 bg-gray-400 rounded-full"></div>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium': return 'bg-green-100 text-green-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBestPrice = () => {
    if (!marketComparison?.markets.length) return null;
    return marketComparison.markets.reduce((best, current) => 
      current.price > best.price ? current : best
    );
  };

  const getWorstPrice = () => {
    if (!marketComparison?.markets.length) return null;
    return marketComparison.markets.reduce((worst, current) => 
      current.price < worst.price ? current : worst
    );
  };

  const handleMarketToggle = (marketId: string) => {
    setSelectedMarkets(prev => {
      if (prev.includes(marketId)) {
        return prev.filter(id => id !== marketId);
      } else {
        return [...prev, marketId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Price Recommendations & Market Comparison
          </h1>
          <p className="text-gray-600">
            Compare prices across multiple markets and get AI-powered insights for better trading decisions
          </p>
        </div>

        {/* Controls */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-xl font-semibold mb-4 lg:mb-0">Market Analysis Dashboard</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'comparison'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Compare Markets
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Crop Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="form-input"
                title="Select crop type"
                aria-label="Select crop type"
              >
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            {/* Market Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Markets to Compare (Choose 2-4 markets)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableMarkets.map(market => (
                  <label key={market.id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedMarkets.includes(market.id)}
                      onChange={() => handleMarketToggle(market.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="truncate">{market.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={fetchPriceData}
            disabled={loading || selectedMarkets.length === 0}
            className="btn-primary"
          >
            {loading ? 'Loading...' : 'Update Analysis'}
          </button>
        </div>

        {/* Quick Insights */}
        {marketComparison && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Best Price</h3>
              <div className="text-green-800">
                <p className="text-lg font-bold">₹{getBestPrice()?.price}/quintal</p>
                <p className="text-sm">{getBestPrice()?.mandi}</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Lowest Price</h3>
              <div className="text-red-800">
                <p className="text-lg font-bold">₹{getWorstPrice()?.price}/quintal</p>
                <p className="text-sm">{getWorstPrice()?.mandi}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Price Difference</h3>
              <div className="text-blue-800">
                <p className="text-lg font-bold">
                  ₹{(getBestPrice()?.price || 0) - (getWorstPrice()?.price || 0)}
                </p>
                <p className="text-sm">Potential savings per quintal</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {priceData.map((item, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.crop}</h3>
                    <p className="text-sm text-gray-600">{item.mandi}</p>
                    <p className="text-xs text-gray-500">{item.state}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(item.trend)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(item.quality)}`}>
                      {item.quality}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <span className="font-semibold text-gray-900 text-lg">₹{item.currentPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Predicted Price:</span>
                    <span className={`font-semibold text-lg ${getTrendColor(item.trend)}`}>
                      ₹{item.predictedPrice}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Change:</span>
                    <span className={`font-semibold ${getTrendColor(item.trend)}`}>
                      {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}
                      ₹{Math.abs(item.predictedPrice - item.currentPrice)} 
                      ({((Math.abs(item.predictedPrice - item.currentPrice) / item.currentPrice) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume Available:</span>
                    <span className="font-semibold text-gray-900">{item.volume} quintals</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="font-semibold text-gray-900">{item.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.confidence >= 80 ? 'bg-green-600 w-80%' : 
                          item.confidence >= 60 ? 'bg-yellow-600 w-60%' : 'bg-red-600 w-40%'
                        }`}
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
        ) : (
          /* Comparison View */
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-6">Market Price Comparison - {selectedCrop}</h2>
            {marketComparison && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (₹/quintal)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance (km)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price vs Best
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marketComparison.markets
                      .sort((a, b) => b.price - a.price)
                      .map((market, index) => {
                        const bestPrice = getBestPrice()?.price || 0;
                        const priceDiff = bestPrice - market.price;
                        const isHighest = market.price === bestPrice;
                        
                        return (
                          <tr key={market.mandiId} className={isHighest ? 'bg-green-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{market.mandi}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{market.state}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-semibold ${isHighest ? 'text-green-600' : 'text-gray-900'}`}>
                                ₹{market.price}
                                {isHighest && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Highest</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{market.volume} quintals</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQualityColor(market.quality)}`}>
                                {market.quality}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{market.distance}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${priceDiff === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {priceDiff === 0 ? 'Best Price' : `-₹${priceDiff}`}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Market Insights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-900">Weather Impact</h3>
                <p className="text-sm text-blue-700">
                  Expected rainfall in the next week may impact {selectedCrop.toLowerCase()} harvesting schedules. 
                  Consider early harvesting to avoid quality degradation.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-medium text-green-900">Export Demand</h3>
                <p className="text-sm text-green-700">
                  High export demand for {selectedCrop.toLowerCase()} is driving prices up in premium markets. 
                  Good time for farmers to sell their premium quality produce.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-medium text-yellow-900">Storage Alert</h3>
                <p className="text-sm text-yellow-700">
                  Warehouse capacity is reaching limits for {selectedCrop.toLowerCase()} storage in some regions. 
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
                    <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Demand</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full w-5/6"></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Government Policies</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-purple-600 h-2 rounded-full w-3/5"></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Global Market</span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-600 h-2 rounded-full w-2/3"></div>
                  </div>
                  <span className="text-sm font-medium">70%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default PriceRecommendationsPage;
