import React, { useState } from 'react';
import { LocationPoint } from '../../services/map/mapApiService';
import mapApiService from '../../services/map/mapApiService';
import { getCurrentLocation } from '../../utils/mapHelpers';
import toast from 'react-hot-toast';

const commodityOptions = [
  { value: '', label: 'All Commodities' },
  { value: 'wheat', label: '🌾 Wheat' },
  { value: 'rice', label: '🌾 Rice' },
  { value: 'vegetables', label: '🥬 Vegetables' },
  { value: 'fruits', label: '🍎 Fruits' },
  { value: 'onion', label: '🧅 Onion' },
  { value: 'potato', label: '🥔 Potato' },
  { value: 'tomato', label: '🍅 Tomato' },
  { value: 'cotton', label: '🌱 Cotton' },
  { value: 'soybean', label: '🌱 Soybean' },
  { value: 'spices', label: '🌶️ Spices' },
  { value: 'flowers', label: '🌸 Flowers' }
];

interface SearchPanelProps {
  onLocationSelect: (location: LocationPoint) => void;
  onCommoditySelect: (commodity: string) => void;
  userLocation?: LocationPoint | null;
  selectedCommodity: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  onLocationSelect, 
  onCommoditySelect, 
  userLocation, 
  selectedCommodity 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setLoading(true);
    try {
      const response = await mapApiService.geocodeAddress(searchQuery);
      onLocationSelect(response);
      toast.success('Location found and updated');
    } catch (error) {
      console.error('Location search failed:', error);
      toast.error('Failed to find location. Please try a different search term.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationHandler = async () => {
    setLocationLoading(true);
    try {
      const location = await getCurrentLocation();
      onLocationSelect(location);
      toast.success('Current location updated');
    } catch (error) {
      console.error('Failed to get current location:', error);
      toast.error('Failed to get current location. Please check your browser permissions.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  const selectedCommodityOption = commodityOptions.find(
    option => option.value === selectedCommodity
  ) || commodityOptions[0];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🔍 Search Mandis
      </h2>
      
      {/* Current Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Location
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={getCurrentLocationHandler}
            disabled={locationLoading}
            className="btn-primary flex-1 text-sm"
          >
            {locationLoading ? (
              '⏳ Getting Location...'
            ) : (
              '📍 Use Current Location'
            )}
          </button>
        </div>
        {userLocation && (
          <p className="text-xs text-gray-500 mt-1">
            📍 {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
          </p>
        )}
      </div>

      {/* Location Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Location
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city, state, or address..."
            className="form-input flex-1"
          />
          <button
            onClick={handleLocationSearch}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
      </div>

      {/* Commodity Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Commodity
        </label>
        <select
          value={selectedCommodity}
          onChange={(e) => onCommoditySelect(e.target.value)}
          className="form-input"
          title="Filter by commodity"
        >
          {commodityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Tips */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Search Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use your current location for best results</li>
          <li>• Search by city name (e.g., "Delhi", "Mumbai")</li>
          <li>• Filter by commodity to find specific markets</li>
          <li>• Click on map markers to see mandi details</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPanel;
