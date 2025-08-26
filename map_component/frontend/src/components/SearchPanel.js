import React, { useState } from 'react';
import Select from 'react-select';
import apiService from '../services/apiService';
import { getCurrentLocation } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
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

const SearchPanel = ({ 
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
      const response = await apiService.geocodeAddress(searchQuery);
      if (response.success) {
        const { latitude, longitude } = response.data;
        onLocationSelect({ lat: latitude, lon: longitude });
        toast.success(`Location found: ${response.data.address}`);
      }
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

  const handleKeyPress = (e) => {
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
            className="btn btn-outline flex-1"
          >
            {locationLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>📍 Use Current Location</>
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
            placeholder="Enter city, district, or address"
            className="input flex-1"
          />
          <button
            onClick={handleLocationSearch}
            disabled={loading || !searchQuery.trim()}
            className="btn btn-primary px-3"
          >
            {loading ? <LoadingSpinner size="small" /> : '🔍'}
          </button>
        </div>
      </div>

      {/* Commodity Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Commodity
        </label>
        <Select
          options={commodityOptions}
          value={selectedCommodityOption}
          onChange={(option) => onCommoditySelect(option.value)}
          className="text-sm"
          classNamePrefix="select"
          placeholder="Select commodity..."
          isSearchable
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCommoditySelect('vegetables')}
            className="btn btn-outline text-xs"
          >
            🥬 Vegetables
          </button>
          <button
            onClick={() => onCommoditySelect('fruits')}
            className="btn btn-outline text-xs"
          >
            🍎 Fruits
          </button>
          <button
            onClick={() => onCommoditySelect('wheat')}
            className="btn btn-outline text-xs"
          >
            🌾 Grains
          </button>
          <button
            onClick={() => onCommoditySelect('onion')}
            className="btn btn-outline text-xs"
          >
            🧅 Onion
          </button>
        </div>
      </div>

      {/* Search Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Search Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use specific locations like "Delhi", "Mumbai Central"</li>
          <li>• Select commodities to find specialized mandis</li>
          <li>• Click on map markers to see mandi details</li>
          <li>• Select multiple mandis for route optimization</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPanel;
