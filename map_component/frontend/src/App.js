import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import MapComponent from './components/MapComponent';
import SearchPanel from './components/SearchPanel';
import MandiList from './components/MandiList';
import PriceRecommendations from './components/PriceRecommendations';
import RouteOptimizer from './components/RouteOptimizer';
import LoadingSpinner from './components/LoadingSpinner';
import apiService from './services/apiService';
import { getCurrentLocation } from './utils/helpers';
import toast from 'react-hot-toast';

function App() {
  const [selectedMandis, setSelectedMandis] = useState([]);
  const [nearbyMandis, setNearbyMandis] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('search');
  const [priceRecommendations, setPriceRecommendations] = useState(null);
  const [optimalRoute, setOptimalRoute] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check API health
      await apiService.healthCheck();
      
      // Get user location
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Load nearby mandis
        await loadNearbyMandis(location.lat, location.lon);
      } catch (locationError) {
        console.warn('Could not get user location:', locationError);
        toast.error('Location access denied. You can still search for mandis manually.');
        
        // Default to Delhi coordinates
        const defaultLocation = { lat: 28.6139, lon: 77.2090 };
        setUserLocation(defaultLocation);
        await loadNearbyMandis(defaultLocation.lat, defaultLocation.lon);
      }
    } catch (error) {
      console.error('App initialization failed:', error);
      toast.error('Failed to initialize the application. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyMandis = async (lat, lon, radius = 100, commodity = null) => {
    try {
      const response = await apiService.getNearbyMandis(lat, lon, radius, commodity);
      if (response.success) {
        setNearbyMandis(response.data.mandis);
      }
    } catch (error) {
      console.error('Failed to load nearby mandis:', error);
      toast.error('Failed to load nearby mandis');
    }
  };

  const handleLocationSelect = async (location) => {
    setUserLocation(location);
    await loadNearbyMandis(location.lat, location.lon, 100, selectedCommodity);
  };

  const handleCommoditySelect = async (commodity) => {
    setSelectedCommodity(commodity);
    if (userLocation) {
      await loadNearbyMandis(userLocation.lat, userLocation.lon, 100, commodity);
      
      // Load price recommendations
      if (commodity) {
        await loadPriceRecommendations(userLocation.lat, userLocation.lon, commodity);
      }
    }
  };

  const loadPriceRecommendations = async (lat, lon, commodity) => {
    try {
      const response = await apiService.getPriceRecommendations(lat, lon, commodity);
      if (response.success) {
        setPriceRecommendations(response.data);
      }
    } catch (error) {
      console.error('Failed to load price recommendations:', error);
    }
  };

  const handleMandiSelect = (mandi) => {
    const isSelected = selectedMandis.find(m => m.id === mandi.id);
    if (isSelected) {
      setSelectedMandis(selectedMandis.filter(m => m.id !== mandi.id));
    } else {
      if (selectedMandis.length >= 10) {
        toast.error('Maximum 10 mandis can be selected for route optimization');
        return;
      }
      setSelectedMandis([...selectedMandis, mandi]);
    }
  };

  const optimizeRoute = async () => {
    if (!userLocation || selectedMandis.length === 0) {
      toast.error('Please select your location and at least one mandi');
      return;
    }

    try {
      const mandiIds = selectedMandis.map(m => m.id);
      const response = await apiService.planMandiRoute(userLocation, mandiIds, 'time');
      
      if (response.success) {
        setOptimalRoute(response.data);
        setActiveTab('route');
        toast.success('Route optimized successfully!');
      }
    } catch (error) {
      console.error('Route optimization failed:', error);
      toast.error('Failed to optimize route');
    }
  };

  const clearSelection = () => {
    setSelectedMandis([]);
    setOptimalRoute(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Loading Agro Cloud Mandi Locator
          </h2>
          <p className="mt-2 text-gray-500">
            Initializing your agricultural marketplace finder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-agriculture-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Agro Cloud Mandi Locator
                </h1>
                <p className="text-sm text-gray-500">
                  Smart Agricultural Marketplace Finder
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedMandis.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="badge badge-success">
                    {selectedMandis.length} Selected
                  </span>
                  <button
                    onClick={optimizeRoute}
                    className="btn btn-primary"
                  >
                    🎯 Optimize Route
                  </button>
                  <button
                    onClick={clearSelection}
                    className="btn btn-secondary"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Search and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <div className="flex space-x-1">
                {[
                  { id: 'search', label: 'Search', icon: '🔍' },
                  { id: 'prices', label: 'Prices', icon: '💰' },
                  { id: 'route', label: 'Route', icon: '🗺️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'search' && (
              <>
                <SearchPanel
                  onLocationSelect={handleLocationSelect}
                  onCommoditySelect={handleCommoditySelect}
                  userLocation={userLocation}
                  selectedCommodity={selectedCommodity}
                />
                <MandiList
                  mandis={nearbyMandis}
                  selectedMandis={selectedMandis}
                  onMandiSelect={handleMandiSelect}
                  userLocation={userLocation}
                />
              </>
            )}

            {activeTab === 'prices' && (
              <PriceRecommendations
                recommendations={priceRecommendations}
                selectedCommodity={selectedCommodity}
                onCommoditySelect={handleCommoditySelect}
              />
            )}

            {activeTab === 'route' && (
              <RouteOptimizer
                selectedMandis={selectedMandis}
                optimalRoute={optimalRoute}
                userLocation={userLocation}
                onOptimize={optimizeRoute}
                onClear={clearSelection}
              />
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-96 lg:h-[600px]">
                <MapComponent
                  mandis={nearbyMandis}
                  selectedMandis={selectedMandis}
                  userLocation={userLocation}
                  optimalRoute={optimalRoute}
                  onMandiSelect={handleMandiSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Agro Cloud Mandi Locator - Empowering farmers with smart marketplace solutions
            </p>
            <p className="mt-1">
              🌱 Built for the agricultural community | 📍 Powered by Azure Maps
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
