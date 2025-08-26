import React from 'react';
import Select from 'react-select';
import { formatCurrency, getCommodityIcon } from '../utils/helpers';

const commodityOptions = [
  { value: 'wheat', label: '🌾 Wheat' },
  { value: 'rice', label: '🌾 Rice' },
  { value: 'vegetables', label: '🥬 Vegetables' },
  { value: 'fruits', label: '🍎 Fruits' },
  { value: 'onion', label: '🧅 Onion' },
  { value: 'potato', label: '🥔 Potato' },
  { value: 'tomato', label: '🍅 Tomato' },
  { value: 'cotton', label: '🌱 Cotton' },
  { value: 'soybean', label: '🌱 Soybean' }
];

const PriceRecommendations = ({ 
  recommendations, 
  selectedCommodity, 
  onCommoditySelect 
}) => {
  const selectedOption = commodityOptions.find(
    option => option.value === selectedCommodity
  );

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'volatile': return '🔄';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      case 'volatile': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Commodity Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Price Recommendations
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Commodity
          </label>
          <Select
            options={commodityOptions}
            value={selectedOption}
            onChange={(option) => onCommoditySelect(option.value)}
            className="text-sm"
            classNamePrefix="select"
            placeholder="Choose a commodity..."
            isSearchable
          />
        </div>

        {!selectedCommodity && (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-gray-500">
              Select a commodity to view price recommendations
            </p>
          </div>
        )}
      </div>

      {/* Price Information */}
      {recommendations && (
        <>
          {/* Price Analysis */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              {getCommodityIcon(recommendations.commodity)} {recommendations.commodity} Price Analysis
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Average Price</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(recommendations.priceAnalysis.averagePrice)}
                </p>
                <p className="text-xs text-blue-600">
                  {recommendations.basePrice.unit}
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">Price Range</p>
                <p className="text-sm font-bold text-gray-900">
                  {recommendations.priceAnalysis.priceRange}
                </p>
                <p className={`text-xs font-medium flex items-center justify-center ${getTrendColor(recommendations.priceAnalysis.trend)}`}>
                  {getTrendIcon(recommendations.priceAnalysis.trend)} {recommendations.priceAnalysis.trend}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Mandis */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">
              🏪 Recommended Mandis ({recommendations.recommendedMandis.length})
            </h3>
            
            <div className="space-y-3">
              {recommendations.recommendedMandis.map((mandi, index) => (
                <div 
                  key={mandi.id} 
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{mandi.name}</h4>
                      <p className="text-xs text-gray-500">{mandi.state}, {mandi.district}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(mandi.estimatedPrice.afterFees)}
                      </span>
                      <p className="text-xs text-gray-500">{recommendations.basePrice.unit}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Distance:</span>
                      <span className="ml-1 font-medium">{mandi.distance?.toFixed(1)} km</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <span className="ml-1 font-medium">⭐ {mandi.rating}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fee:</span>
                      <span className="ml-1 font-medium">{mandi.marketFee}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Market Score: {mandi.marketAdvantage}%
                    </span>
                    <span className="text-xs text-gray-500">
                      Before fees: {formatCurrency(mandi.estimatedPrice.estimatedPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Insights */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-3">📊 Market Insights</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">💡 Best Value</h4>
                <p className="text-xs text-yellow-700">
                  {recommendations.recommendedMandis[0]?.name} offers the best price after considering distance and fees.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">✅ Recommendation</h4>
                <p className="text-xs text-green-700">
                  Current {recommendations.commodity} prices are {recommendations.priceAnalysis.trend}. 
                  Consider visiting verified mandis within 50km for the best deals.
                </p>
              </div>
              
              <div className="text-xs text-gray-500 text-center pt-2 border-t">
                Last updated: {new Date(recommendations.priceAnalysis.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Commodity Selection */}
      {!selectedCommodity && (
        <div className="card">
          <h3 className="font-medium text-gray-900 mb-3">🌾 Popular Commodities</h3>
          <div className="grid grid-cols-2 gap-2">
            {commodityOptions.slice(0, 6).map((commodity) => (
              <button
                key={commodity.value}
                onClick={() => onCommoditySelect(commodity.value)}
                className="btn btn-outline text-xs justify-start"
              >
                {commodity.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceRecommendations;
